// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InvoiceFinancing {
    struct Invoice {
        uint256 id;
        address seller;
        address buyer;
        address investor;
        uint256 amount;
        uint256 discountedAmount;
        uint256 dueDate;
        string invoiceHash;
        InvoiceStatus status;
        uint256 createdAt;
    }
    
    enum InvoiceStatus { Created, BuyerConfirmed, Funded, Completed, Defaulted }
    
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) public sellerInvoices;
    mapping(address => uint256[]) public investorInvoices;
    mapping(string => bool) public usedInvoiceHashes;
    
    uint256 public invoiceCounter;
    uint256 public platformFee = 100; // 1%
    address public owner;
    
    event InvoiceCreated(uint256 indexed invoiceId, address seller, uint256 amount);
    event BuyerConfirmed(uint256 indexed invoiceId, address buyer);
    event InvoiceFunded(uint256 indexed invoiceId, address investor, uint256 amount);
    event InvoiceCompleted(uint256 indexed invoiceId, uint256 profit);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function createInvoice(
        address _buyer,
        uint256 _amount,
        uint256 _dueDate,
        string memory _invoiceHash
    ) external {
        require(!usedInvoiceHashes[_invoiceHash], "Invoice already exists");
        require(_dueDate > block.timestamp, "Invalid due date");
        
        invoiceCounter++;
        invoices[invoiceCounter] = Invoice({
            id: invoiceCounter,
            seller: msg.sender,
            buyer: _buyer,
            investor: address(0),
            amount: _amount,
            discountedAmount: 0,
            dueDate: _dueDate,
            invoiceHash: _invoiceHash,
            status: InvoiceStatus.Created,
            createdAt: block.timestamp
        });
        
        sellerInvoices[msg.sender].push(invoiceCounter);
        usedInvoiceHashes[_invoiceHash] = true;
        
        emit InvoiceCreated(invoiceCounter, msg.sender, _amount);
    }
    
    function confirmInvoice(uint256 _invoiceId) external {
        Invoice storage invoice = invoices[_invoiceId];
        require(msg.sender == invoice.buyer, "Not the buyer");
        require(invoice.status == InvoiceStatus.Created, "Invalid status");
        
        invoice.status = InvoiceStatus.BuyerConfirmed;
        emit BuyerConfirmed(_invoiceId, msg.sender);
    }
    
    function fundInvoice(uint256 _invoiceId, uint256 _discountedAmount) external payable {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.status == InvoiceStatus.BuyerConfirmed, "Not confirmed");
        require(msg.value == _discountedAmount, "Incorrect amount");
        require(_discountedAmount < invoice.amount, "Invalid discount");
        
        invoice.investor = msg.sender;
        invoice.discountedAmount = _discountedAmount;
        invoice.status = InvoiceStatus.Funded;
        
        investorInvoices[msg.sender].push(_invoiceId);
        
        // Transfer funds to seller
        payable(invoice.seller).transfer(_discountedAmount);
        
        emit InvoiceFunded(_invoiceId, msg.sender, _discountedAmount);
    }
    
    function repayInvoice(uint256 _invoiceId) external payable {
        Invoice storage invoice = invoices[_invoiceId];
        require(msg.sender == invoice.buyer, "Not the buyer");
        require(invoice.status == InvoiceStatus.Funded, "Not funded");
        require(msg.value == invoice.amount, "Incorrect amount");
        
        uint256 platformFeeAmount = (invoice.amount * platformFee) / 10000;
        uint256 investorAmount = invoice.amount - platformFeeAmount;
        
        payable(invoice.investor).transfer(investorAmount);
        payable(owner).transfer(platformFeeAmount);
        
        invoice.status = InvoiceStatus.Completed;
        
        uint256 profit = investorAmount - invoice.discountedAmount;
        emit InvoiceCompleted(_invoiceId, profit);
    }
    
    function getInvoice(uint256 _invoiceId) external view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
    
    function getSellerInvoices(address _seller) external view returns (uint256[] memory) {
        return sellerInvoices[_seller];
    }
    
    function getInvestorInvoices(address _investor) external view returns (uint256[] memory) {
        return investorInvoices[_investor];
    }
}