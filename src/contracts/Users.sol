pragma solidity ^0.5.0;

contract Users {
    string public name;
    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string name;
        string merge;
        string cityst;
        string cityend;
        string amount;
        uint256 tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string name,
        string merge,
        string cityst,
        string cityend,
        string amount,
        uint256 tipAmount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string name,
        string merge,
        string cityst,
        string cityend,
        uint256 tipAmount,
        address payable author
    );

    event ImagePaid(
        uint256 id,
        string hash,
        string name,
        string merge,
        string cityst,
        string cityend,
        string amount,
        address payable author
    );

    constructor() public {
        name = "Decentragram";
    }

    function uploadImage(
        string memory _imgHash,
        string memory _name,
        string memory _merge,
        string memory _cityst,
        string memory _cityend,
        string memory _amount
    ) public {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);
        // Make sure image name exists
        require(bytes(_name).length > 0);
        require(bytes(_merge).length > 0);
        require(bytes(_cityst).length > 0);
        require(bytes(_cityend).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        require(bytes(_amount).length > 0);

        // Increment image id
        imageCount++;

        // Add Image to the contract
        images[imageCount] = Image(
            imageCount,
            _imgHash,
            _name,
            _merge,
            _cityst,
            _cityend,
            _amount,
            0,
            msg.sender
        );
        // Trigger an event
        emit ImageCreated(
            imageCount,
            _imgHash,
            _name,
            _merge,
            _cityst,
            _cityend,
            _amount,
            0,
            msg.sender
        );
    }

    function tipImageOwner(uint256 _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageCount);
        // Fetch the image
        Image memory _image = images[_id];
        // Fetch the author
        address payable _author = _image.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Increment the tip amount
        _image.tipAmount = _image.tipAmount + msg.value;
        // Update the image
        images[_id] = _image;
        // Trigger an event
        emit ImageTipped(
            _id,
            _image.hash,
            _image.name,
            _image.merge,
            _image.cityst,
            _image.cityend,
            _image.tipAmount,
            _author
        );
    }

    function payImageOwner(uint256 _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageCount);
        // Fetch the image
        Image memory _image = images[_id];
        // Fetch the author
        address payable _author = _image.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Increment the tip amount
        // _image.amount = 0;
        // Update the image
        images[_id] = _image;
        // Trigger an event
        emit ImagePaid(
            _id,
            _image.hash,
            _image.name,
            _image.merge,
            _image.cityst,
            _image.cityend,
            _image.amount,
            _author
        );
    }
}
