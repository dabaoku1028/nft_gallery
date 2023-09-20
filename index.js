//Ref: https://gist.github.com/timothycarambat/6367567cd8fb56a31d7f869c570efadf
//Ref: https://github.com/designcourse/metamask-connect-vanilla-js/blob/main/index.js

import MetaMaskOnboarding from '@metamask/onboarding';
// alchemy-nft-api/alchemy-web3-script.js
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const onboarding = new MetaMaskOnboarding();
const btn = document.querySelector('.onboard');
const statusText = document.querySelector('.h1');
const statusDesc = document.querySelector('.desc');
const loader = document.querySelector('.loader');
const upArrow = document.querySelector('.up');

// Initialize an alchemy-web3 instance:
// We use Alchemy API to fetch NFT data, you can change to Eth mainnet, Ploygon etc.
const web3 = createAlchemyWeb3(
  `https://eth-rinkeby.alchemyapi.io/v2/{YOUR_API}`,
);

btn.addEventListener('click', async () => {
    btn.style.backgroundColor = '#cccccc';
    loader.style.display = 'block';

    try {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        connected(accounts)
    } catch (error) {
        console.error(error);
    }
})


let connected = (accounts) => {
    statusText.innerHTML = 'Account Address:'
    statusDesc.classList.add('account');
    statusDesc.innerHTML = accounts[0]
    btn.style.display = 'none';
    loader.style.display = 'none';
    upArrow.style.display = 'none';
    statusDesc.classList.add('account');

    DisPlay(accounts[0]);
}

async function DisPlay(account){
    // The wallet address we want to query for NFTs:
    const nfts = await web3.alchemy.getNfts({
        owner: account
    })
    console.log(nfts);
    getNFTItems(nfts.ownedNfts);
}

async function connectWallet() {
    return await ethereum.request({ method: 'eth_accounts' });
}

const MetaMaskClientCheck = () => {
    connectWallet().then((accounts) => {
        if (accounts && accounts[0] > 0) {
            connected(accounts)
        } else {
            statusText.innerHTML = 'Welcome to AaronSea'
            statusDesc.innerHTML = `To begin, please connect your MetaMask wallet.`
            btn.innerText = 'Connect MetaMask'
            upArrow.style.display = 'block';
        }
    })    
}


async function getNFTItems(nfts) {
    const osContainer = document.getElementById('NFTItems')

    if (nfts.length === 0) { return }

    nfts.forEach((nft) => {
      const name = nft.metadata.name
      const tokenType = nft.id.tokenMetadata.tokenType
      const image_url = nft.media[0].raw

      const newElement = document.createElement('div')
      newElement.innerHTML = `
      <a href='${image_url}' target="_blank">
        <div class='flex flex-col'>
          <img
            src='${image_url}'
            class='rounded-lg' />
          <div class='flex-col w-full space-y-1'>
            <p class='text-gray-900 text-lg'>${name}</p>
            <p class='text-gray-800 text-xs word-wrap'>tokenType: ${tokenType}</p>
          </div>
        </div>
      </a>
      `

      osContainer.appendChild(newElement)
    })
  }

  MetaMaskClientCheck()