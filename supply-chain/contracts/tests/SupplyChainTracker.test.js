const { expect } = require("chai");
const { ethers } = require("hardhat");
// If you need anyValue, ensure you have a compatible version and use:
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs.js");

describe("SupplyChainTracker", function () {
  let SupplyChainTracker;
  let supplyChainTracker;
  let admin, manufacturer, handler, other;

  beforeEach(async () => {
    // Set up signers: admin is the deployer
    [admin, manufacturer, handler, other] = await ethers.getSigners();

    // Deploy the contract using the admin account
    SupplyChainTracker = await ethers.getContractFactory("SupplyChainTracker", admin);
    supplyChainTracker = await SupplyChainTracker.deploy();
    await supplyChainTracker.deployed();
  });

  it("should deploy and assign roles to the deployer (admin)", async () => {
    expect(await supplyChainTracker.admin()).to.equal(admin.address);
    expect(await supplyChainTracker.manufacturers(admin.address)).to.equal(true);
    expect(await supplyChainTracker.handlers(admin.address)).to.equal(true);
  });

  it("should allow admin to grant and revoke roles", async () => {
    // Grant manufacturer role to 'manufacturer'
    await expect(supplyChainTracker.grantManufacturerRole(manufacturer.address))
      .to.emit(supplyChainTracker, "RoleGranted")
      .withArgs(manufacturer.address, "MANUFACTURER");
    expect(await supplyChainTracker.manufacturers(manufacturer.address)).to.equal(true);

    // Revoke manufacturer role from 'manufacturer'
    await expect(supplyChainTracker.revokeManufacturerRole(manufacturer.address))
      .to.emit(supplyChainTracker, "RoleRevoked")
      .withArgs(manufacturer.address, "MANUFACTURER");
    expect(await supplyChainTracker.manufacturers(manufacturer.address)).to.equal(false);

    // Grant handler role to 'handler'
    await expect(supplyChainTracker.grantHandlerRole(handler.address))
      .to.emit(supplyChainTracker, "RoleGranted")
      .withArgs(handler.address, "HANDLER");
    expect(await supplyChainTracker.handlers(handler.address)).to.equal(true);

    // Revoke handler role from 'handler'
    await expect(supplyChainTracker.revokeHandlerRole(handler.address))
      .to.emit(supplyChainTracker, "RoleRevoked")
      .withArgs(handler.address, "HANDLER");
    expect(await supplyChainTracker.handlers(handler.address)).to.equal(false);
  });

  it("should allow a manufacturer to create a product", async () => {
    // Grant manufacturer role to the 'manufacturer' account
    await supplyChainTracker.grantManufacturerRole(manufacturer.address);
    const manufacturerContract = supplyChainTracker.connect(manufacturer);

    // Create a product
    const tx = await manufacturerContract.createProduct("Product A", "Description A");
    const receipt = await tx.wait();

    // Check for the ProductCreated event
    const event = receipt.events.find(e => e.event === "ProductCreated");
    expect(event.args.name).to.equal("Product A");
    expect(event.args.manufacturer).to.equal(manufacturer.address);

    // Retrieve the product details
    const product = await manufacturerContract.getProduct(1);
    expect(product.id).to.equal(1);
    expect(product.name).to.equal("Product A");
    expect(product.description).to.equal("Description A");
    expect(product.manufacturer).to.equal(manufacturer.address);
    expect(product.qrCode).to.include("https://supply-chain.example/product/1");
  });

  it("should allow a manufacturer to create a batch and update each product's batchId", async () => {
    await supplyChainTracker.grantManufacturerRole(manufacturer.address);
    const manufacturerContract = supplyChainTracker.connect(manufacturer);

    // Create two products
    await manufacturerContract.createProduct("Product A", "Description A");
    await manufacturerContract.createProduct("Product B", "Description B");

    // Create a batch with product IDs 1 and 2
    const tx = await manufacturerContract.createBatch([1, 2]);
    const receipt = await tx.wait();

    const event = receipt.events.find(e => e.event === "BatchCreated");
    expect(event.args.batchId).to.equal(1);

    // Verify that both products have been assigned the batchId
    const product1 = await manufacturerContract.getProduct(1);
    const product2 = await manufacturerContract.getProduct(2);
    expect(product1.batchId).to.equal(1);
    expect(product2.batchId).to.equal(1);

    // Retrieve the batch details and check its content
    const batch = await manufacturerContract.getBatch(1);
    expect(batch.id).to.equal(1);
    expect(batch.productIds.map(id => id.toNumber())).to.eql([1, 2]);
  });

  it("should allow a handler to update a product and emit events", async () => {
    await supplyChainTracker.grantManufacturerRole(manufacturer.address);
    await supplyChainTracker.grantHandlerRole(handler.address);

    const manufacturerContract = supplyChainTracker.connect(manufacturer);
    const tx1 = await manufacturerContract.createProduct("Product A", "Description A");
    await tx1.wait();

    const handlerContract = supplyChainTracker.connect(handler);
    const tx2 = await handlerContract.updateProduct(1, "Location X", "Notes here", 1, 2000);
    const receipt2 = await tx2.wait();

    const event = receipt2.events.find(e => e.event === "ProductUpdated");
    expect(event.args.id).to.equal(1);
    expect(event.args.handler).to.equal(handler.address);
    expect(event.args.location).to.equal("Location X");
    expect(event.args.status).to.equal(1);
    expect(event.args.temperature).to.equal(2000);

    const product = await handlerContract.getProduct(1);
    expect(product.status).to.equal(1);
    expect(product.temperature).to.equal(2000);

    const update = await handlerContract.getUpdate(1, 1);
    expect(update.handler).to.equal(handler.address);
    expect(update.location).to.equal("Location X");
    expect(update.notes).to.equal("Notes here");
    expect(update.status).to.equal(1);
    expect(update.temperature).to.equal(2000);
  });

  it("should emit TemperatureAlert when temperature is out of thresholds", async () => {
    await supplyChainTracker.grantManufacturerRole(manufacturer.address);
    await supplyChainTracker.grantHandlerRole(handler.address);

    const manufacturerContract = supplyChainTracker.connect(manufacturer);
    await manufacturerContract.createProduct("Product A", "Description A");

    const handlerContract = supplyChainTracker.connect(handler);
    
    // Test with a temperature below the minimum (minTemperature is 1500)
    let tx = await handlerContract.updateProduct(1, "Location Y", "Low Temp Test", 1, 1400);
    let receipt = await tx.wait();
    let event = receipt.events.find(e => e.event === "TemperatureAlert");
    expect(event.args.productId).to.equal(1);
    expect(event.args.temperature).to.equal(1400);
    // Check that the timestamp is present (it will be a BigNumber)
    expect(event.args.timestamp).to.be.an("object");

    // Test with a temperature above the maximum (maxTemperature is 2500)
    tx = await handlerContract.updateProduct(1, "Location Z", "High Temp Test", 1, 2600);
    receipt = await tx.wait();
    event = receipt.events.find(e => e.event === "TemperatureAlert");
    expect(event.args.productId).to.equal(1);
    expect(event.args.temperature).to.equal(2600);
    expect(event.args.timestamp).to.be.an("object");
  });


  it("should allow admin to update temperature thresholds", async () => {
    await supplyChainTracker.setTemperatureThresholds(1600, 2400);
    expect(await supplyChainTracker.minTemperature()).to.equal(1600);
    expect(await supplyChainTracker.maxTemperature()).to.equal(2400);
  });
});
