pragma solidity ^0.5.0;

contract Users {
    string public name;
    uint256 public imageCount = 0;
    mapping(uint256 => Image) public images;

    struct Image {
        uint256 id;
        string hash;
        string name;
        uint256 tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint256 id,
        string hash,
        string name,
        uint256 tipAmount,
        address payable author
    );

    event ImageTipped(
        uint256 id,
        string hash,
        string name,
        uint256 tipAmount,
        address payable author
    );

    constructor() public {
        name = "Decentragram";
    }

    function uploadImage(string memory _imgHash, string memory _name) public {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);
        // Make sure image name exists
        require(bytes(_name).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment image id
        imageCount++;

        // Add Image to the contract
        images[imageCount] = Image(imageCount, _imgHash, _name, 0, msg.sender);
        // Trigger an event
        emit ImageCreated(imageCount, _imgHash, _name, 0, msg.sender);
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
            _image.tipAmount,
            _author
        );
    }
}
