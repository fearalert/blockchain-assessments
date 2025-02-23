// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SupplyChainTracker {
    // Role management
    mapping(address => bool) public manufacturers;
    mapping(address => bool) public handlers;
    address public admin;

    struct Product {
        uint256 id;
        string name;
        string description;
        address manufacturer;
        uint256 timestamp;
        Status status;
        mapping(uint256 => TrackingUpdate) updates;
        uint256 updateCount;
        string qrCode;
        uint256 temperature;
        uint256 batchId;
    }

    struct TrackingUpdate {
        address handler;
        string location;
        string notes;
        uint256 timestamp;
        Status status;
        uint256 temperature;
    }

    struct Batch {
        uint256 id;
        uint256[] productIds;
        uint256 timestamp;
        Status status;
    }

    enum Status {
        Created,
        InTransit,
        Delivered,
        Rejected
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Batch) public batches;
    uint256 public productCount;
    uint256 public batchCount;

    // Temperature thresholds (in Celsius * 100 for precision)
    uint256 public minTemperature = 1500; // 15.00°C
    uint256 public maxTemperature = 2500; // 25.00°C

    event ProductCreated(
        uint256 indexed id,
        string name,
        address indexed manufacturer,
        uint256 timestamp,
        string qrCode
    );

    event ProductUpdated(
        uint256 indexed id,
        address indexed handler,
        string location,
        Status status,
        uint256 timestamp,
        uint256 temperature
    );

    event BatchCreated(
        uint256 indexed batchId,
        uint256[] productIds,
        uint256 timestamp
    );

    event TemperatureAlert(
        uint256 indexed productId,
        uint256 temperature,
        uint256 timestamp
    );

    event RoleGranted(address account, string role);
    event RoleRevoked(address account, string role);

    constructor() {
        admin = msg.sender;
        manufacturers[msg.sender] = true;
        handlers[msg.sender] = true;
    }

    // Role management modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Must have manufacturer role");
        _;
    }

    modifier onlyHandler() {
        require(handlers[msg.sender], "Must have handler role");
        _;
    }

    modifier productExists(uint256 _productId) {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        _;
    }

    // Role management functions
    function grantManufacturerRole(address account) public onlyAdmin {
        manufacturers[account] = true;
        emit RoleGranted(account, "MANUFACTURER");
    }

    function revokeManufacturerRole(address account) public onlyAdmin {
        manufacturers[account] = false;
        emit RoleRevoked(account, "MANUFACTURER");
    }

    function grantHandlerRole(address account) public onlyAdmin {
        handlers[account] = true;
        emit RoleGranted(account, "HANDLER");
    }

    function revokeHandlerRole(address account) public onlyAdmin {
        handlers[account] = false;
        emit RoleRevoked(account, "HANDLER");
    }

    function generateQRCode(uint256 _productId) internal pure returns (string memory) {
        // Convert the product ID to a string using string concatenation
        bytes memory idBytes = new bytes(32);
        uint256 tempId = _productId;
        uint256 digits;
        
        // Count digits
        while (tempId != 0) {
            digits++;
            tempId /= 10;
        }
        
        // Convert to string
        tempId = _productId;
        for(uint256 i = 0; i < digits; i++) {
            idBytes[digits - 1 - i] = bytes1(uint8(48 + (tempId % 10)));
            tempId /= 10;
        }
        
        // Create final string
        bytes memory baseURL = "https://supply-chain.example/product/";
        bytes memory result = new bytes(baseURL.length + digits);
        
        for(uint256 i = 0; i < baseURL.length; i++) {
            result[i] = baseURL[i];
        }
        for(uint256 i = 0; i < digits; i++) {
            result[baseURL.length + i] = idBytes[i];
        }
        
        return string(result);
    }

    function createProduct(
        string memory _name,
        string memory _description
    ) public onlyManufacturer returns (uint256) {
        productCount++;
        Product storage newProduct = products[productCount];
        newProduct.id = productCount;
        newProduct.name = _name;
        newProduct.description = _description;
        newProduct.manufacturer = msg.sender;
        newProduct.timestamp = block.timestamp;
        newProduct.status = Status.Created;
        newProduct.updateCount = 0;
        newProduct.qrCode = generateQRCode(productCount);

        emit ProductCreated(
            productCount,
            _name,
            msg.sender,
            block.timestamp,
            newProduct.qrCode
        );

        return productCount;
    }

    function createBatch(uint256[] memory _productIds) public onlyManufacturer returns (uint256) {
        require(_productIds.length > 0, "Batch must contain at least one product");
        
        batchCount++;
        Batch storage newBatch = batches[batchCount];
        newBatch.id = batchCount;
        newBatch.productIds = _productIds;
        newBatch.timestamp = block.timestamp;
        newBatch.status = Status.Created;

        // Update batch ID for all products in the batch
        for (uint256 i = 0; i < _productIds.length; i++) {
            require(_productIds[i] <= productCount, "Invalid product ID");
            products[_productIds[i]].batchId = batchCount;
        }

        emit BatchCreated(batchCount, _productIds, block.timestamp);
        return batchCount;
    }

    function updateProduct(
        uint256 _productId,
        string memory _location,
        string memory _notes,
        Status _status,
        uint256 _temperature
    ) public onlyHandler productExists(_productId) {
        Product storage product = products[_productId];
        product.updateCount++;
        
        TrackingUpdate storage update = product.updates[product.updateCount];
        update.handler = msg.sender;
        update.location = _location;
        update.notes = _notes;
        update.timestamp = block.timestamp;
        update.status = _status;
        update.temperature = _temperature;
        
        product.status = _status;
        product.temperature = _temperature;

        // Check temperature thresholds
        if (_temperature < minTemperature || _temperature > maxTemperature) {
            emit TemperatureAlert(_productId, _temperature, block.timestamp);
        }

        emit ProductUpdated(
            _productId,
            msg.sender,
            _location,
            _status,
            block.timestamp,
            _temperature
        );

        // If product is part of a batch, update batch status
        if (product.batchId > 0) {
            updateBatchStatus(product.batchId, _status);
        }
    }

    function updateBatchStatus(uint256 _batchId, Status _status) internal {
        require(_batchId <= batchCount, "Batch does not exist");
        batches[_batchId].status = _status;
    }

    function getProduct(uint256 _productId) public view 
        productExists(_productId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            address manufacturer,
            uint256 timestamp,
            Status status,
            uint256 updateCount,
            string memory qrCode,
            uint256 temperature,
            uint256 batchId
        ) {
        Product storage product = products[_productId];
        return (
            product.id,
            product.name,
            product.description,
            product.manufacturer,
            product.timestamp,
            product.status,
            product.updateCount,
            product.qrCode,
            product.temperature,
            product.batchId
        );
    }

    function getUpdate(uint256 _productId, uint256 _updateId) public view 
        productExists(_productId)
        returns (
            address handler,
            string memory location,
            string memory notes,
            uint256 timestamp,
            Status status,
            uint256 temperature
        ) {
        require(_updateId <= products[_productId].updateCount, "Update does not exist");
        TrackingUpdate storage update = products[_productId].updates[_updateId];
        return (
            update.handler,
            update.location,
            update.notes,
            update.timestamp,
            update.status,
            update.temperature
        );
    }

    function getBatch(uint256 _batchId) public view returns (
        uint256 id,
        uint256[] memory productIds,
        uint256 timestamp,
        Status status
    ) {
        require(_batchId <= batchCount, "Batch does not exist");
        Batch storage batch = batches[_batchId];
        return (
            batch.id,
            batch.productIds,
            batch.timestamp,
            batch.status
        );
    }

    function setTemperatureThresholds(uint256 _min, uint256 _max) public onlyAdmin {
        require(_min < _max, "Invalid temperature range");
        minTemperature = _min;
        maxTemperature = _max;
    }
}