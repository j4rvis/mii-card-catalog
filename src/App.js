import logo from './logo.svg';
import './App.css';
import MkmApi from './mkmapi.js';
import { useEffect, useState } from 'react';
import env from '../.env.json'



let token = env || {}

const App = () => {
  const [wantsLists, setWantsLists] = useState([])
  const [cards, setCards] = useState([])

  const api = new MkmApi(token.baseUrl, token.appToken, token.appSecret, token.accessToken, token.accessSecret);
  useEffect( async () => {
  
    let getWantsList = await api.send('wantslist', 'GET')
    setWantsLists(getWantsList.data.wantslist)

    console.log("fetched wants", getWantsList)
  }, [])

  const handleWantsListClick = async (want) => {
    let listItemsPath = want.links.find(link => link.rel === 'list_items')
    let path = listItemsPath.href.substring(1)
    let cardResponse = await api.send(path, 'GET')
    console.log(cardResponse.data.wantslist.item)
    setCards(cardResponse.data.wantslist.item)
  }

  const drawWantsListEntries = () => {
    if (!wantsLists) return <span>No data</span>
    const lists = wantsLists.map(want => {
      return <li key={want.idWantsList} onClick={() => handleWantsListClick(want)}>{want.name}</li>
    })
    return lists
  }

  const drawCardEntries = () => {
    if (!cards) return <span>No data</span>
    const lists = cards.map(card => {
      return <li key={card.idProduct}>{card.product.enName}</li>
    })
    return lists
  }

  return (
    <div className="App">
      <h1>Wantslists</h1>
      <div className="content">
        <ul className="lists">
          {drawWantsListEntries()}
        </ul>
        <ul className="cards">
          {drawCardEntries()}
        </ul>
      </div>
    </div>
  );
}

export default App;
