// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title NFT Marketplace
/// @author Ben BK

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error NFTMarketplace__NotTheOwner();
error NFTMarketplace__PriceIsNull();
error NFTMarketplace__ListingPriceNotMet();
error NFTMarketplace__NotNftOwner();
error NFTMarketplace__SalePriceNotMet();

contract NFTMarketplace is ERC721URIStorage {
    // We need to keep track of the last nft Id
    uint private _nftIds;
    // The number of items that are currently on sale
    uint private _nftsSold;

    // Fee given to the owner of the smart contract for each sale
    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => NFT) private idToNFT;

    struct NFT {
      uint256 nftId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

    event NFTItemCreated (
      uint256 indexed nftId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    constructor() ERC721("Ben BK NFT Marketplace", "BBKNFTM") {
      owner = payable(msg.sender);
    }

    /// @notice Updates the listing price of the contract
    /// @param _listingPrice The new listing price
    function updateListingPrice(uint _listingPrice) public payable {
      if(owner != msg.sender) {
        revert NFTMarketplace__NotTheOwner();
      }
      listingPrice = _listingPrice;
    }

    /// @notice Returns the listing price of the contract 
    /// @return listingPrice The listing price
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /// @notice Mints a NFT and lists it in the marketplace 
    /// @param tokenURI The TokenURI of the NFT
    /// @param price The price of the NFT
    /// @return newNFTId The id of the NFT
    function createNFT(string memory tokenURI, uint256 price) public payable returns (uint) {
      _nftIds = _nftIds + 1;
      uint256 newNFTId = _nftIds;

      _mint(msg.sender, newNFTId);
      _setTokenURI(newNFTId, tokenURI);
      createNFTItem(newNFTId, price);
      return newNFTId;
    }

    /// @notice List a new NFT on the Marketplace
    /// @param nftId The id of the NFT
    /// @param price The price of the NFT
    function createNFTItem(
      uint256 nftId,
      uint256 price
    ) private {
      if(price <= 0) {
        revert NFTMarketplace__PriceIsNull();
      }
      if(msg.value != listingPrice) {
        revert NFTMarketplace__ListingPriceNotMet();
      }

      idToNFT[nftId] =  NFT(
        nftId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

      _transfer(msg.sender, address(this), nftId);
      emit NFTItemCreated(
        nftId,
        msg.sender,
        address(this),
        price,
        false
      );
    }

    /// @notice Allows someone to resell a NFT they have purchased
    /// @param nftId The Id of the NFT 
    /// @param price The new Price of the NFT
    function resellNFT(uint256 nftId, uint256 price) public payable {
      if(idToNFT[nftId].owner != msg.sender) {
        revert NFTMarketplace__NotNftOwner();
      }
      if(msg.value != listingPrice) {
        revert NFTMarketplace__ListingPriceNotMet();
      }
      idToNFT[nftId].sold = false;
      idToNFT[nftId].price = price;
      idToNFT[nftId].seller = payable(msg.sender);
      idToNFT[nftId].owner = payable(address(this));
      _nftsSold--;

      _transfer(msg.sender, address(this), nftId);
    }

    /// @notice Allows a user to buy an NFT that is on the Marketplace
    /// @param nftId The Id of the NFT
    function buy(uint256 nftId) public payable {
      uint price = idToNFT[nftId].price;
      address seller = idToNFT[nftId].seller;
      if(msg.value != price) {
        revert NFTMarketplace__SalePriceNotMet();
      }
      
      idToNFT[nftId].owner = payable(msg.sender);
      idToNFT[nftId].sold = true;
      idToNFT[nftId].seller = payable(address(0));
      _nftsSold++;
      _transfer(address(this), msg.sender, nftId);
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /// @notice Returns all unsold market items, all the items that are currently beeing sold
    /// @return All the unsold market items
    function fetchNFTs() public view returns (NFT[] memory) {
      uint nftCount = _nftIds;
      uint unsoldNFTCount = _nftIds - _nftsSold;
      uint currentIndex = 0;

      NFT[] memory nfts = new NFT[](unsoldNFTCount);
      for (uint i = 0; i < nftCount; i++) {
        if (idToNFT[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          NFT storage currentItem = idToNFT[currentId];
          nfts[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return nfts;
    }

    /// @notice Returns only items that a user has purchased
    /// @return Returns all the items that a user has purchased
    function fetchMyNFTs() public view returns (NFT[] memory) {
      uint totalNFTCount = _nftIds;
      uint nftCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalNFTCount; i++) {
        if (idToNFT[i + 1].owner == msg.sender) {
          nftCount += 1;
        }
      }

      NFT[] memory nfts = new NFT[](nftCount);
      for (uint i = 0; i < totalNFTCount; i++) {
        if (idToNFT[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          NFT storage currentItem = idToNFT[currentId];
          nfts[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return nfts;
    }

    /// @notice Returns only items a user has listed 
    /// @return All the items a user has listed
    function fetchItemsListed() public view returns (NFT[] memory) {
      uint totalNFTCount = _nftIds;
      uint nftCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalNFTCount; i++) {
        if (idToNFT[i + 1].seller == msg.sender) {
          nftCount += 1;
        }
      }

      NFT[] memory nfts = new NFT[](nftCount);
      for (uint i = 0; i < totalNFTCount; i++) {
        if (idToNFT[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          NFT storage currentItem = idToNFT[currentId];
          nfts[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return nfts;
    }
}