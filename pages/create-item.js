
   
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketaddress } from "../config"
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


const CreateItem = () => {

    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', descriptoin: '' })

    const router = useRouter()

    const onChange = async (e) => {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`receives: ${prog}`)
                }
            )

            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)

        } catch (error) {
            console.log(error)
        }   
    }

    const createItem = async () => {
        const { name, descriptoin, price} = formInput
        if (!name || !descriptoin || !price) {
            console.log("name or descriptoin or price error ")
            return
        }

        const data = JSON.stringify({
            name, descriptoin, image: fileUrl
        })

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}` 

            createSale(url)

        } catch (error) {
            console.log('Error uploading file', error)
        }
    }

    const createSale = async () => {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(nftaddress, NFT.abi, signer)

    }

    

    return (
        <div>create-item</div>
    )
}

export default CreateItem