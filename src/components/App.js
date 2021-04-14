import Users from '../abis/Users.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Map from './Map'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Users.networks[networkId]
    if (networkData) {
      const user = new web3.eth.Contract(Users.abi, networkData.address)
      this.setState({ user })
      const imagesCount = await user.methods.imageCount().call()
      this.setState({ imagesCount })
      // Load images
      for (var i = 1; i <= imagesCount; i++) {
        const image = await user.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      // Sort images. Show highest tipped images first
      this.setState({
        images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount)
      })
      this.setState({ loading: false })
    } else {
      window.alert('user contract not deployed to detected network.')
    }
  }

  captureFile = event => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadImage = (name, merge, cityst, cityend, amount) => {
    console.log("Submitting file to ipfs...")

    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if (error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.user.methods.uploadImage(result[0].hash, name, merge, cityst, cityend, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  tipImageOwner(id, tipAmount) {
    this.setState({ loading: true })
    this.state.user.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  payImageOwner(id, amount) {
    this.setState({ loading: true })
    this.state.user.methods.payImageOwner(id).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      user: null,
      images: [],
      loading: true,
      map: false
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.tipImageOwner = this.tipImageOwner.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.payImageOwner = this.payImageOwner.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <br /><br />&nbsp;
        <button type="submit" className="btn btn-primary btn-md" onClick={() => this.setState({ map: !this.state.map })}>Map!</button>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : this.state.map ? <Map /> : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImageOwner={this.tipImageOwner}
            payImageOwner={this.payImageOwner}
          />
        }
      </div>
    );
  }
}

export default App;