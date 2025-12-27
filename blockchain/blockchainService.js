const { ethers } = require('ethers');
const contractABI = require('./InvoiceFinancingABI.json');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        this.contract = new ethers.Contract(this.contractAddress, contractABI, this.provider);
    }

    async createInvoice(sellerPrivateKey, buyer, amount, dueDate, invoiceHash) {
        const wallet = new ethers.Wallet(sellerPrivateKey, this.provider);
        const contractWithSigner = this.contract.connect(wallet);
        
        const tx = await contractWithSigner.createInvoice(
            buyer,
            ethers.parseEther(amount.toString()),
            Math.floor(dueDate.getTime() / 1000),
            invoiceHash
        );
        
        return await tx.wait();
    }

    async confirmInvoice(buyerPrivateKey, invoiceId) {
        const wallet = new ethers.Wallet(buyerPrivateKey, this.provider);
        const contractWithSigner = this.contract.connect(wallet);
        
        const tx = await contractWithSigner.confirmInvoice(invoiceId);
        return await tx.wait();
    }

    async fundInvoice(investorPrivateKey, invoiceId, discountedAmount) {
        const wallet = new ethers.Wallet(investorPrivateKey, this.provider);
        const contractWithSigner = this.contract.connect(wallet);
        
        const tx = await contractWithSigner.fundInvoice(invoiceId, ethers.parseEther(discountedAmount.toString()), {
            value: ethers.parseEther(discountedAmount.toString())
        });
        
        return await tx.wait();
    }

    async repayInvoice(buyerPrivateKey, invoiceId, amount) {
        const wallet = new ethers.Wallet(buyerPrivateKey, this.provider);
        const contractWithSigner = this.contract.connect(wallet);
        
        const tx = await contractWithSigner.repayInvoice(invoiceId, {
            value: ethers.parseEther(amount.toString())
        });
        
        return await tx.wait();
    }

    async getInvoice(invoiceId) {
        return await this.contract.getInvoice(invoiceId);
    }

    async getSellerInvoices(sellerAddress) {
        return await this.contract.getSellerInvoices(sellerAddress);
    }

    async getInvestorInvoices(investorAddress) {
        return await this.contract.getInvestorInvoices(investorAddress);
    }
}

module.exports = BlockchainService;