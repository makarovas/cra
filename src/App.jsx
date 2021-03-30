import React from 'react';
import './App.scss';
import Spinner from './components/Spinner'
import ErrorMessage from './components/ErrorMessage'

class App extends React.Component {
  state = {
    address: 'https://jsonplaceholder.typicode.com/users',
    requestsToMake: 30,
    requestsMade: 0,
    averageResponseTime: 0,
    isLoading: false,
    isError: false,
    users: null,
    listRequestDuration: []
  };

  handleRequestsChange = (event) => 
    this.setState({requestsToMake: event.currentTarget.valueAsNumber});

  fetchApi = async () => {
      while ( !this.state.isError && (this.state.requestsToMake > 0)) {
        try {

          const request_start_at = performance.now();
          this.setState({isLoading: true});
          const response = await fetch(this.state.address)
          const json = await response.json();
          const request_end_at = performance.now();
          const request_duration = request_end_at - request_start_at;

          this.setState(prev => ({
            users: json, 
            isLoading: false,
            requestsToMake: prev.requestsToMake - 1,
            requestsMade: prev.requestsMade + 1,
            averageResponseTime: this.counter(),
            listRequestDuration: [...prev.listRequestDuration, request_duration]
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

   counter = () =>  this.state.listRequestDuration
     .reduce((prev, curr) => (prev + curr) / this.state.requestsMade,0)
    
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
                 Average response time: 
               <span>
                <b>{`${averageResponseTime ? averageResponseTime : 'press start' } 
                     ${averageResponseTime ?  'ms' : ''}`} 
                </b>
               </span>
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
