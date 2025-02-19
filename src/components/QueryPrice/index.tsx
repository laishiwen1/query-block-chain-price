import { useEffect, useState } from 'react'
import {Select, Button, Space, Spin, message} from 'antd'

let timer: number | undefined;
const QueryPrice = () => {
  const [coinList, setCoinList] = useState([]);
  const [coinListLoading, setCoinListLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [price, setPrice] = useState('');
  const [refreshPriceLoading, setRefreshPriceLoading] = useState(false);

  const AsyncQueryCoinsList = () => {
    const CoinList = 'coin_list';
    const localDataSource = JSON.parse(localStorage.getItem(CoinList) || '0');

    if(localDataSource){
      setCoinList(localDataSource);
      return;
    }

    setCoinListLoading(true);
    fetch('https://api.coingecko.com/api/v3/coins/list')
    .then(response => response.json())
    .then(data => {
        const dataSource = data.map((item: Record<string, string>) => {
            return {value: item.id, label: item.name, symbol: item.symbol}
        })
        localStorage.setItem(CoinList, JSON.stringify(dataSource));
        setCoinList(dataSource);
    }).finally(() => {
      setCoinListLoading(false)
    });
  }
  
  const AsyncQueryCoinPrice = async (id: string) => {
    setRefreshPriceLoading(true);

    return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
    .then(response => response.json())
    .then(data => {
      const price = data[id].usd;
      setPrice(`${price}`)
    })
    .catch(error => {
      message.open({
        type: 'error',
        content: JSON.stringify(error),
      });
    })
    .finally(() => {
      setRefreshPriceLoading(false)
    })
  }

  const handleQueryPrice = async () => {
    clearInterval(timer);
    console.log('emit query price');
    setPriceLoading(true);
    await AsyncQueryCoinPrice(selectedCoin)
    setPriceLoading(false)
    timer = setInterval(AsyncQueryCoinPrice,10000, selectedCoin)
  }

  useEffect(() => {
    AsyncQueryCoinsList();
  },[])

  return (
    <div>
      <p>实时查询区块链币</p>
      <Space>
      <Select
        showSearch
        allowClear
        options={coinList}
        style={{ width: 200 }}
        loading={coinListLoading}
        onChange={(value) => {
          setSelectedCoin(value);
          setPrice('')
        }}
        placeholder="请选择你的币种"
      />
      <Button disabled={!selectedCoin} onClick={handleQueryPrice} loading={priceLoading}>查询</Button>
      </Space>
      <p style={{marginTop: 20}}>
        <span>当前选择的币种是: {selectedCoin || '未选择'} {!!price && <>, USD的实时价格为: ${price}</>}</span> <Spin spinning={refreshPriceLoading}/>
      </p>
    </div>
  )
}

export default QueryPrice