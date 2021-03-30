import React from 'react';
import './App.scss';
import Spinner from './components/Spinner'
import ErrorMessage from './components/ErrorMessage'

class App extends React.Component {
  state = {
    address: 'https://jsonplaceholder.typicode.com/users',
    requestsToMake: 30,
    requestsMade: 0,
    averageResponseTime: null,
    isLoading: false,
    isError: false,
    users: null
  };

  handleRequestsChange = (event) => {
    let requestsToMake = event.currentTarget.valueAsNumber;
    // requestsToMake = Math.min(requestsToMake, 500);
    // requestsToMake = Math.max(requestsToMake, 0);
    this.setState({requestsToMake});
  };

  fetchApi = async () => {
      while ( this.state.requestsToMake && !this.state.isError> 0) {
        try {
          this.setState({isLoading: true});
          const response = await fetch(this.state.address)
          const json = await response.json();
          this.setState(prev => ({
            users: json, 
            isLoading: false,
            requestsToMake: prev.requestsToMake - 1,
            requestsMade: prev.requestsMade + 1,
          }))
        } catch (e) {
          this.setState({
            isError: true,
            isLoading: false,
            });
      }
    }
  }

  handleChange = (event) => 
    this.setState({
      address: event.currentTarget.value,
      isError:false
    })

   startMetrics = () => {
        this.fetchApi()
   }

   restart = () => {
     this.setState({  
      address: 'https://jsonplaceholder.typicode.com/users',
      requestsToMake: 30,
      requestsMade: 0,
      averageResponseTime: null,
      isLoading: false,
      isError: false,
     users: null
    })
   }
  
  render() {
    const {
      address,
      requestsToMake,
      requestsMade,
      averageResponseTime,
      isError,
      isLoading,
    } = this.state;

    return (
      <>
          <div>
            <div className="task">
              Нужно рассчитать среднее время отклика от какого либо урла
              <ul>
                <li>
                  Можно добавлять и использовать любые необходымие зависимости
                </li>
              </ul>
              <ul>
                <li>Address - поле для урла</li>
                <li>Requests to make - количество запросов, которое мы сделаем</li>
                <li>Average response time - среднее время отклика</li>
                <li>Requests made - счетчик сделаных реквестов</li>
                <li>Start! - кнопка старта для расчета</li>
                <li>+ во время расчета форма должна дизейблиться</li>
                <li>
                  + если произошла ошибка, то нужно об этом сообщать, достаточно
                  простого alert'а
                </li>
              </ul>
            </div>
            <div className="app">
              <div className="app__line">
                <label>
                  <span>Address: </span>
                  <input
                    type="text"
                    value={address}
                    onChange={this.handleChange}
                  />
                </label>
              </div>
              <div className="app__line">
                <label>
                  <span>Requests to make: </span>
                  <input
                    type="number"
                    value={requestsToMake}
                    onChange={this.handleRequestsChange}
                  />
                </label>
              </div>
              <div className="app__line">
                {'Average response time: '}
                <b>{JSON.stringify(averageResponseTime)} </b>
              </div>
              <div className="app__line">
                {`Requests made: ${requestsMade} of ${requestsToMake}`}
              </div>
              <div className="app__line">
                <button 
                  onClick={this.startMetrics} 
                  disabled={isLoading || isError}>
                     {isLoading ?  <Spinner/> : 'Start'}
                </button>
                <button 
                  onClick={this.restart} 
                  disabled={isLoading}>
                    Restart
                </button>
              </div>
            </div>
          </div>
        {!isLoading && isError && <ErrorMessage/>}
      </>
    );
  }
}

export default App;