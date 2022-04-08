
   
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import axios from 'axios'

import { nftaddress, nftmarketaddress } from "../config"
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const MyAssets = () => {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('non-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    const loadNFTs = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
    
        const marketplaceContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const data = await marketplaceContract.fetchMyNFTs()
    
        const items = await Promise.all(data.map(async i => {
          const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenURI)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI
          }
          return item
        }))
        setNfts(items)
        setLoadingState('loaded') 
    }

    if(loadingState == 'loaded' && !nfts.length) return (
        <h1 className="px-20 py-10 text-3xl">No assets owned</h1>
    )

    return (
        <div className='flex justify-center'>
            <div className='p-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                    {
                        nfts.map((nft, i) => {
                            <div className='border shadow rounded-xl overflow-hidden' key={i}>
                                <img 
                                    className='rounded'
                                    src={nft.image}
                                />
                                <div className='p-4 bg-black'>
                                    <p className='text-2xl font-bold text-white'>Price - {nft.price} ETH</p>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div> 
        </div>
    )
}

export default MyAssets