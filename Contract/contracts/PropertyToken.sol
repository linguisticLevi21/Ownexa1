// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyToken is ERC1155,ERC1155Holder, Ownable {

    // =========================
    // STRUCTS
    // =========================

    struct Property {
        uint256 id;
        uint256 tokensupply;
        string tokename;
        uint256 pricepertoken;
        uint256 settlementPrice ; 
        bool active;
    }

    struct Listing {
        uint256 listingId;
        uint256 propertyId;
        uint256 amount;
        uint256 pricepertoken;
        address seller;
        bool active;
    }

    // =========================
    // STORAGE
    // =========================

    Property[] public allProperty;

    mapping(uint256 => uint256) public primaryRemaining;
    mapping(uint256 => uint256) public settlementPool;
    mapping(uint256 => bool) public settled;
    uint256 public listingCounter;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => address) public propertyLister;
    uint256 public accumulatedCommission;

    // =========================
    // EVENTS
    // =========================

    event PropertyListed(uint256 indexed propertyId, address indexed owner, uint256 tokenSupply, uint256 pricePerToken);
    event PrimaryTokensBought(uint256 indexed propertyId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event ListingCreated(uint256 indexed listingId, uint256 indexed propertyId, address indexed seller, uint256 amount, uint256 pricePerToken);
    event ListingCancelled(uint256 indexed listingId, address indexed seller);
    event ListingBought(uint256 indexed listingId, address indexed buyer, uint256 totalPrice);
    event PropertySettled(uint256 indexed propertyId, uint256 settlementAmount);
    event TokensRedeemed(uint256 indexed propertyId, address indexed user, uint256 tokenAmount, uint256 payout);

    // =========================
    // CONSTRUCTOR
    // =========================

   constructor() ERC1155("") Ownable(msg.sender) {} 

    // =========================
    // PROPERTY LISTING (MINT)
    // =========================

    function listProperty(
        address lister , 
        uint256 _tokensupply,
        uint256 _pricepertoken,
        string memory _tokename 
    ) external {
        require(_tokensupply > 0, "Invalid token supply");
        require(_pricepertoken > 0, "Invalid price");
        uint256 propertyId = allProperty.length;
        allProperty.push(
            Property({
                id: propertyId,
                tokensupply: _tokensupply,
                tokename: _tokename,
                pricepertoken: _pricepertoken,
                settlementPrice : _pricepertoken , 
                active: true
            })
        );
        propertyLister[propertyId] = lister;
        _mint(address(this), propertyId, _tokensupply, "");
        primaryRemaining[propertyId] = _tokensupply;
        emit PropertyListed(propertyId, lister, _tokensupply, _pricepertoken);
    }

    // =========================
    // PRIMARY BUY
    // =========================

    function buyTokens(uint256 _propertyId, uint256 _amount) external payable {
        require(_propertyId < allProperty.length, "Invalid property");
        require(_amount > 0, "Invalid amount");
        Property storage property = allProperty[_propertyId];
        require(property.active, "Property not active");
        require(primaryRemaining[_propertyId] >= _amount, "Not enough tokens");
        uint256 basePrice = property.pricepertoken * _amount;
        uint256 commission = (basePrice * 2) / 100;
        uint256 totalPrice = basePrice + commission;
        require(msg.value == totalPrice, "Incorrect ETH sent");
        (bool success1, ) = propertyLister[_propertyId].call{value: basePrice}("");
        require(success1, "ETH transfer failed");
        accumulatedCommission += commission;
        primaryRemaining[_propertyId] -= _amount;
        _safeTransferFrom(address(this), msg.sender, _propertyId, _amount, "");
        emit PrimaryTokensBought(_propertyId, msg.sender, _amount, totalPrice);
    }

    // =========================
    // CREATE LISTING
    // =========================

    function createListing(
        uint256 _propertyId,
        uint256 _amount,
        uint256 _price 
    ) external {
        require(_propertyId < allProperty.length, "Invalid property");
        require(allProperty[_propertyId].active, "Property not active");
        require(_amount > 0, "Invalid amount");
        require(_price > 0, "Invalid price");
        require(balanceOf(msg.sender, _propertyId) >= _amount, "Not enough tokens");
        uint256 listingId = listingCounter++;
        _safeTransferFrom(msg.sender, address(this), _propertyId, _amount, "");
        listings[listingId] = Listing({
            listingId: listingId,
            propertyId: _propertyId,
            amount: _amount,
            pricepertoken: _price,
            seller: msg.sender,
            active: true
        }) ; 
        emit ListingCreated(listingId, _propertyId, msg.sender, _amount, _price);
    }

    // =========================
    // CANCEL LISTING
    // =========================

    function cancelListing(uint256 _listingId) external {
        require(_listingId < listingCounter, "Invalid listing");
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not owner");
        listing.active = false;
        _safeTransferFrom(address(this), msg.sender, listing.propertyId, listing.amount, "");
        emit ListingCancelled(_listingId, msg.sender);
    } 

    // =========================
    // BUY LISTING (SECONDARY)
    // =========================

    function buyListing(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(allProperty[listing.propertyId].active, "Property not active");
        uint256 basePrice = listing.pricepertoken * listing.amount;
        uint256 commission = (basePrice * 2) / 100;
        uint256 totalPrice = basePrice + commission;
        require(msg.value == totalPrice, "Incorrect ETH sent");
        accumulatedCommission += commission;
        listing.active = false;
        (bool success2, ) = listing.seller.call{value: basePrice}("");
        require(success2, "ETH transfer failed"); 
        _safeTransferFrom(address(this), msg.sender, listing.propertyId, listing.amount, "");
        emit ListingBought(_listingId, msg.sender, totalPrice);
    } 

    // =========================
    // SETTLE PROPERTY
    // =========================

  function settleProperty(uint256 _propertyId) external payable {
    require(_propertyId < allProperty.length, "Invalid property");
    require(allProperty[_propertyId].active, "Already settled");
    require(propertyLister[_propertyId] == msg.sender, "Not property owner");
    require(msg.value > 0, "No ETH sent");

    uint256 totalSupply = allProperty[_propertyId].tokensupply;

    // 1️⃣ Derive new settlement price per token
    uint256 newPricePerToken = msg.value / totalSupply;
    require(newPricePerToken > 0, "Settlement too low");
     allProperty[_propertyId].settlementPrice = newPricePerToken ; 
    // 2️⃣ Unsold tokens held by contract
    uint256 unsold = balanceOf(address(this), _propertyId);

    // 3️⃣ Refund owner at NEW price
    uint256 refundToOwner = unsold * newPricePerToken;

    // 4️⃣ Burn unsold tokens
    if (unsold > 0) {
        _burn(address(this), _propertyId, unsold);
    }

    // 5️⃣ Refund owner
    if (refundToOwner > 0) {
        (bool ok1, ) = msg.sender.call{value: refundToOwner}("");
        require(ok1, "Owner refund failed");
    }

    // 6️⃣ Remaining ETH goes to settlement pool
    settlementPool[_propertyId] = msg.value - refundToOwner;

    settled[_propertyId] = true;
    allProperty[_propertyId].active = false;

    emit PropertySettled(_propertyId, settlementPool[_propertyId]);
}// =========================
    // REDEEM TOKENS
    // =========================

  function redeemTokens(uint256 _propertyId) external {
    require(_propertyId < allProperty.length, "Invalid property");
    require(settled[_propertyId], "Not settled");

    uint256 userBalance = balanceOf(msg.sender, _propertyId);
    require(userBalance > 0, "No tokens");

    uint256 price = allProperty[_propertyId].settlementPrice;

    uint256 payout = userBalance * price;
    require(payout > 0, "Nothing to redeem");
    require(settlementPool[_propertyId] >= payout, "Insufficient pool");

    // burn user tokens
    _burn(msg.sender, _propertyId, userBalance);

    // update pool
    settlementPool[_propertyId] -= payout;

    // send ETH
    (bool ok, ) = msg.sender.call{value: payout}("");
    require(ok, "ETH transfer failed");

    emit TokensRedeemed(_propertyId, msg.sender, userBalance, payout);
}

    // =========================
    // WITHDRAW COMMISSION
    // =========================

    function withdrawCommission() external onlyOwner {
        require(accumulatedCommission > 0, "No commission");
        uint256 amount = accumulatedCommission;
        accumulatedCommission = 0;
        (bool success4, ) = owner().call{value: amount}("");
        require(success4, "ETH transfer failed");
    }

   function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155, ERC1155Holder) 
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}
}