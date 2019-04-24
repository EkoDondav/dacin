import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';
//
//import cccy_dacin_arr from './cc_api_listing_dacin_arr_100';
import cccy_dacin_arr from './cc_api_listing_dacin_arr_10';
import da_rds_keys from './da_rds_keys';
import data_keys from './data_keys';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import * as qs from 'query-string';


class App extends Component {
  state = {
    network: '',
    owner: '', //'0xf5caedf0d057ef411d8b8a49f2f3eef3e9a6a3ca',
    address: '', /*pongtoken.options.address,*/
    symbol: '',
    name: '',
    decimals: 0,
    totalSupply: 0,
    balanceOf: '',
    standard: 'ERC-20',
    value: '',
    message: '(no message)',
    address_ref: '',
    dacin: '',
    lastUpdate: '',
    lastTx: '',
    pathToTokens: 'token',
    tokenLoaded: false,
    tokenLoadedFailed: false,
    verified: false,
    countCompLoad: 0,
    stateRd: 0,
    countDacinNew: 0,
    listingCmc: [],
    tokenListCurr: cccy_dacin_arr.data,
    tokenListPageCurr: 1,
    tokenListPageSize: 20,
    tokenListPageMax: 1,
    tokenListSortBy: '',
    tokenListFilter: '',
    tokenListSortReversed: false,
    ticker1: {},
    ticker2: {},
    ticker3: {},
    data_ref: {},
    data_market: {},
    data_cat: {}
  };


  async componentDidMount() {

    console.log('componentDidMount OK');

    if (this.nameInput) {
      this.nameInput.focus();
    }

    /* OFF web3
    const network     = await web3.eth.net.getNetworkType();
    const tokenLoaded = false;
    const tokenLoadedFailed = false;
    const tokenListPageMax = 1 + parseInt((cccy_dacin_arr.data.length-1) / this.state.tokenListPageSize);

    this.setState({ network, tokenLoaded, tokenLoadedFailed, tokenListPageMax });

    await window.ethereum.enable();
    web3.eth.getAccounts().then(console.log);

    console.log("Web3 version: " + web3.version);
    const cp = web3.currentProvider;
    console.log(cp.constructor.name);
    console.log("URL:", process.env.PUBLIC_URL);
    */

    fetch('https://api.coinmarketcap.com/v1/ticker/')
        /*.then(results => {
          return results.json();
        }).then(data => {
          let ttt = data.results;
          console.log("ticker elngth", ttt.length);*/
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            let tickerBySymbol = {}
            for (let i=0; i<data.length;i++){
              tickerBySymbol[data[i].symbol] = { "price_usd" : data[i].price_usd };
            }
            console.log("BTC price_usd =", tickerBySymbol["BTC"]["price_usd"]);
            console.log("XRP price_usd =", tickerBySymbol["XRP"]["price_usd"]);
            //this.state.ticker = tickerBySymbol;

            //this.setState({ticker1:tickerBySymbol}); // <-- cleans ref data form... :-(
          });
    /*})*/


  }


  componentDidUpdate() {
    if (this.nameInput) {
      this.nameInput.focus();
    }
    if (this.state.tokenListFilter) {
      this.nameInput.selectionStart = this.nameInput.selectionEnd = this.state.tokenListFilter.length;
    }
  }


  getDacin() {
    const c = '0123456789BCDFGHJKLMNPQRSTVWXYZ';
    const l = c.length;
    let base = '';
    let sumstr = '';
    for (let i=0; i<8; i++) {
      let _c = c[Math.trunc(Math.random() * l)];
      if (i === 0) { _c = c[1 + Math.trunc(Math.random() * (l-1))]; }
      base += _c;
      if (isNaN(_c)) {
        sumstr += "" + (_c.charCodeAt(0) - 55); // "A".charCodeAt(0) = 65
      } else {
        sumstr += _c;
      }
    }
    //let z = sumstr.split('');
    let qs = 0;
    for (let i=0; i<sumstr.length; i++){
      qs += sumstr[i]-0;
    }
    let cs = 98 - (qs % 97);
    return "DA0000" + base + cs;
    //this.setState({ random: this.state.random + rand });
  }


  onCreate () {
    console.log('onCreate...');
    let self = this;
    //self.setState({ message: 'Waiting on transaction success...' });
    //document.getElementById('btn_create').firstChild.data = 'creating reference data contract... .';
    document.getElementById('btn_create').innerText = 'creating contract... .';
    document.getElementById('btnCreateLoader').style.display = 'inline-flex';
    //self.setState({ message: 'Waiting on transaction success...' });
    ////self.setState({ address_ref: 'creating reference data contract... ' });
    //document.getElementById('btnCreateLabel').innerText = 'creating reference data contract...';
    //document.getElementById('btnCreateLoader').style.display = 'inline-flex';
    ////document.getElementById('btn_create').disabled = true;
    setTimeout(function(){
      document.getElementById('btn_create').style.display = 'none';
      self.setState({
        address_ref: '0xca35b7d915458ef540ade6068dfe2f44e8fa733c',
        dacin: self.state.dacin !== '' ? self.state.dacin : self.getDacin(), /*'DA 0000 RFTG 4GTA 23',*/
        message: 'Contract created successfully!',
        stateRd: 1});
      //document.getElementById('btn_create').style.display = 'none';
      let els = document.getElementsByClassName('ipt-rdt');
      for (let i=0; i<els.length; i++){
        els[i].style.display = 'initial';
      }

    }, 2000);
  };


  onSaveByDacin = () => {
    console.log('onSaveByDacin...');
    let self = this;
    document.getElementById('btn_save').firstChild.data = 'writing data... .';
    if (document.getElementById('btnSaveLoader')) {document.getElementById('btnSaveLoader').style.display = 'inline-flex'};
    setTimeout(function(){
      document.getElementById('btn_save').firstChild.data = 'data saved';
      if (document.getElementById('btnSaveLoader')) {document.getElementById('btnSaveLoader').style.display = 'none';}
      let els = document.getElementsByClassName('ipt-rdt');
      for (let i=0; i<els.length; i++){
        els[i].disabled = true;
      }
      let now = new Date();
      //self.setState({ lastUpdate: now_str, lastTx: '0x4f460162dec68de3482275e698b6647a532c0f7f3fe4895c55d84e14a2d8d052' });
      self.state.lastUpdate = ""+now;
      self.state.lastTx = '';
      self.state.stateRd = 2; // saved
      document.getElementById('RdLu').innerText = ""+now;
      document.getElementById('RdTx').innerText = "";

      //'address_ref': self.state.address_ref,
      let _o = {
        'dacin': self.state.dacin,
        'RdTc': document.getElementById('RdTc').value,
        'RdTsc': document.getElementById('RdTsc').value,
        'RdWs': document.getElementById('RdWs').value,
        'IRdWp': document.getElementById('IRdWp').value,
        'RdLa': document.getElementById('RdLa').value,
        'RdLu': self.state.lastUpdate,
        'RdTx': self.state.lastTx
      };
      //localStorage.setItem(self.state.address,JSON.stringify(_o));
      localStorage.setItem(self.state.dacin,JSON.stringify(_o));

      //let _d = {
      //  'address': self.state.address,
      //  'address_ref': self.state.address_ref
      //};
      //localStorage.setItem(self.state.dacin,JSON.stringify(_d));

      //
    },2000);

  };


  onEnter = () => {
    this.setState({
      address_ref: '',
      dacin: '',
      message: '',
      lastUpdate: '',
      lastTx: '' });
  };


  pasteText = (f,t) => {
    let el =  document.getElementById(f);
    if (el) { el.value = t; el.innerText = t };
  };


  loadRefDataByDacinFile = async(_t) => {
    console.log('loading file', _t, '...');
    await this.setState({'dacin':this.state.dacin});
    const _data = require('./' + _t);
    console.log(JSON.stringify(_data));
  }

  loadRefDataByDacin = async(_t) => {
    console.log('lrd: loading ref data for ', _t, '...');


    await this.setState({'dacin':this.state.dacin});


    let _s = localStorage.getItem(_t);

    //
    if (_s === null && this.state.dacin !== '') {
      _s = JSON.stringify({
        'address_ref': '',
        'dacin': this.state.dacin,
        'RdTc':'',
        'RdTsc':'',
        'RdWs':'',
        'IRdWp':'',
        'RdLa':'',
        'RdLu':'',
        'RdTx':''});
    }
    //
    if (_s !== null) {
      let _o = JSON.parse(_s);
      const _dacin = _o.dacin;
      console.log('lrd:', _t, '->', _dacin, _o.dacin);
      //
      document.getElementById('btn_create').style.display = 'none';
      let els = document.getElementsByClassName('ipt-rdt');
      for (let i=0; i<els.length; i++){
        els[i].style.display = 'initial';
      }
      //
      this.state.dacin = _dacin;
      //this.state.address_ref = localStorage.getItem(_dacin);
      this.state.address_ref = _o.address_ref;
      document.getElementById('RdDc').innerText = _dacin;
      //document.getElementById('RdRt').innerText = localStorage.getItem(_dacin);
      document.getElementById('RdRt').innerText = this.state.address_ref;
      document.getElementById('RdRtL').style.display = 'inherit';
      //document.getElementById('RdTc').value = localStorage.getItem('RdTc');
      document.getElementById('RdTc').value = _o.RdTc;
      //document.getElementById('RdTsc').value = localStorage.getItem('RdTsc');
      document.getElementById('RdTsc').value = _o.RdTsc;
      //document.getElementById('RdWs').value = localStorage.getItem('RdWs');
      document.getElementById('RdWs').value = _o.RdWs;
      document.getElementById('IRdWp').type = 'text';
      //document.getElementById('IRdWp').value = localStorage.getItem('IRdWp');
      document.getElementById('IRdWp').value = _o.IRdWp;
      //document.getElementById('RdLa').value = localStorage.getItem('RdLa');
      document.getElementById('RdLa').value = _o.RdLa;
      //document.getElementById('RdLu').innerText = localStorage.getItem('RdLu');
      document.getElementById('RdLu').innerText = _o.RdLu;
      //this.state.lastTx = localStorage.getItem('RdTx');
      document.getElementById('RdTx').innerText = _o.RdTx;
      document.getElementById('btn_save').innerText = 'update';

      this.state.lastTx = _o.RdTx;

      this.state.stateRd = 2;
      //document.getElementById('RdTx').innerText = localStorage.getItem('RdTx');
      //this.forceUpdate(); // note: overrides the values to element assignments!

      //console.log('lrd: address_ref =');
      //console.log(this.state.address_ref === '');
      //if (this.state.address_ref === ''){this.setState({stateRd:this.state.stateRd})}

      //document.getElementById('dataRef').innerText = JSON.stringify(_o.data_ref);
      //document.getElementById('dataMkt').innerText = JSON.stringify(_o.data_market);

      this.state.data_ref = _o.data_ref;
      this.state.data_market = _o.data_market_24h;
      this.setState({ "data_ref" : _o.data_ref, "data_market" : _o.data_market_24h }); // clears ref data form... :-(



      console.log(this.state.data_ref.digital_asset_name);
      console.log(this.state.data_market.market_cap_usd);

      //return true;
    } else { console.log('lrd: no data'); return false }
  };


  dacinListObject = (page, sort, filt) => {
    console.log('dlo: entering...');

    let _tns = []; //this.state.tokenListCurr.slice(0);

    // filter (by name only)

    if (filt) {
      console.log("dlo: filt =", filt);
      //_tns = Object.keys(_tns.name).filter(key => )
      _tns = this.state.tokenListCurr
          .slice()
          .filter((value, index, array) => {
                return value.name.toLowerCase().startsWith(filt.toLowerCase());
              }
          );
      this.state.tokenListFilter = filt;
      console.log('dlo: new list length after filtering:', _tns.length);
      page = this.state.tokenListPageCurr = 1;
      this.state.tokenListCurr = [];
      this.state.tokenListCurr = _tns.slice();
      console.log('dlo: new list length after filtering:', this.state.tokenListCurr.length);
    }

    // sort (by name or by symbol only)
    if (sort && this.state.tokenListCurr[0][sort]) {
      console.log("dlo: sort =", sort);

      if (sort != this.state.tokenListSortBy || this.state.tokenListSortReversed) {
        _tns = this.state.tokenListCurr
            .slice()
            .sort(function (a, b) {
              var x = a[sort].toLowerCase();
              var y = b[sort].toLowerCase();
              return x < y ? -1 : x > x ? 1 : 0;
            });
        this.state.tokenListSortReversed = false;
        this.state.tokenListCurr = _tns.slice();
      }
      else if (parseInt(page) === this.state.tokenListPageCurr) {
        //  //  console.log('dlo: reversing...');
        _tns = this.state.tokenListCurr.slice().reverse();
        this.state.tokenListSortReversed = true;
        this.state.tokenListCurr = _tns.slice();
      }
      this.state.tokenListSortBy = sort;
    }
    else if (false) {
      this.state.tokenListCurr = cccy_dacin_arr.data.slice();
    }
    else {
      console.log("dlo: no sort ");
      this.state.tokenListSortBy = ''
      _tns = this.state.tokenListCurr.slice();
      console.log("dlo: no sort. _tns.length =", _tns.length);
    }

    if (_tns.length === 0) {
      _tns = this.state.tokenListCurr.slice();
    }

    // pagination
    if (page && parseInt(page) >= 1) {
      console.log("dlo: page =", page);
      const _begin = (parseInt(page) - 1) * this.state.tokenListPageSize;
      const _end = parseInt(page) * this.state.tokenListPageSize;
      this.state.tokenListPageCurr = page;

      _tns = _tns.slice(_begin, _end);
    }

    //this.state.tokenListPageMax = 1 + parseInt(_tns.length / this.state.tokenListPageSize);
    console.log('dlo:', page, sort, filt, _tns.length, this.state.tokenListPageSize, this.state.tokenListPageMax);
    return _tns
  }


  createTableDataRef = () => {
    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < da_rds_keys.data_ref_keys.length; i++) {
      let children = [];
      let _key = da_rds_keys.data_ref_keys[i];
      let _val = JSON.stringify(this.state.data_ref[da_rds_keys.data_ref_keys[i]]);
      //Inner loop to create children
      //for (let j = 0; j < 4; j++) {
      //  children.push(<td>{`Column ${j + 1}`}{_tns[i].name}</td>)
      //}

      children.push(<td key={`dr_k_${i}`} style={{'width':'30%'}}>{_key}</td>)
      children.push(<td key={`dr_v_${i}`} style={{'width':'8em'}}>{_val}</td>)
      //children.push(<td key={`dr_k_${i}`} style={{'width':'8em'}}>{this.state.data_ref[da_rds_keys.data_ref_keys[i]]}</td>)
      //children.push(<td key={`dr_v_${i}`} style={{'width':'8em'}}>{this.state.ticker2[_tns[i].symbol]?this.state.ticker2[_tns[i].symbol]["price_usd"]:""}</td>)

      //Create the parent and add the children
      //<li className="list-group-item">
      // <Link to={'/' + this.state.pathToTokens + '/' + _tns.t1.address}>{_tns.t1.name}</Link>
      // <img style={{'width': '1em', display: localStorage.getItem(_tns.t1.address) != null ? 'initial' : 'none'}} src={'/page_icon.png'} />
      // </li>
      table.push(<tr key={i}>{children}</tr>)
    }
    return table
  }


  createTableDataMkt = () => {
    let table = [];
    let _val_obj = this.state.data_market;
    // Outer loop to create parent
    for (let i = 0; i < da_rds_keys.data_market_keys.length; i++) {
      let children = [];
      let _key = da_rds_keys.data_market_keys[i];
      let _val = JSON.stringify(this.state.data_market[da_rds_keys.data_market_keys[i]]);

      children.push(<td key={`dr_k_${i}`} style={{'width':'30%'}}>{_key}</td>)
      children.push(<td key={`dr_v_${i}`} style={{'width':'8em'}}>{_val}</td>)
      //children.push(<td key={`dr_k_${i}`} style={{'width':'8em'}}>{this.state.data_ref[da_rds_keys.data_ref_keys[i]]}</td>)
      //children.push(<td key={`dr_v_${i}`} style={{'width':'8em'}}>{this.state.ticker2[_tns[i].symbol]?this.state.ticker2[_tns[i].symbol]["price_usd"]:""}</td>)

      //Create the parent and add the children
      //<li className="list-group-item">
      // <Link to={'/' + this.state.pathToTokens + '/' + _tns.t1.address}>{_tns.t1.name}</Link>
      // <img style={{'width': '1em', display: localStorage.getItem(_tns.t1.address) != null ? 'initial' : 'none'}} src={'/page_icon.png'} />
      // </li>
      table.push(<tr key={i}>{children}</tr>)
    }
    return table
  }


  createTableDataSubLoopList = () => {
    let children = [];
    for (let i = 0; i < data_keys.categories.length; i++) {
      //let _lbl = data_keys.keys[data_keys.categories[i]].names[i][1];
      let _key = data_keys.categories[i];
      let _lbl = data_keys.keys[_key].title;
      children.push(<tr key={`cat_${i}`}><td><div><a href={'#'+_key}>{_lbl}</a></div></td></tr>);
    }
    return <table><tbody>{children}</tbody></table>;
  }


  createTableDataSubLoop = () => {
    let children = [];
    for (let i = 0; i < data_keys.categories.length; i++) {
      children.push(this.createTableDataSub(data_keys.categories[i]));
    }
    return children;
  }


  createTableDataSub = (cat) => {
    let table = [];
    //let _val_obj = this.state.data_cat;

    //console.log('createTableDataSub EXAMPLE:', this.state.data_cat[cat][data_keys.keys[cat].names[0][0]]);
    //console.log('createTableDataSub EXAMPLE:', data_keys.categories[0]);
    //console.log('createTableDataSub EXAMPLE:', data_keys.keys[data_keys.categories[0]].title);


    // inner loop to create parent
    for (let i = 0; i < data_keys.keys[cat].names.length; i++) {
      let children = [];
      let _lbl = data_keys.keys[cat].names[i][1];
      let _key = data_keys.keys[cat].names[i][0];
      //console.log('createTableDataSub:',_lbl);
      //console.log('createTableDataSub:',_key);
      let _val = JSON.stringify(this.state.data_cat[cat][_key]);
      if (typeof _val == 'string' && _val.length >= 2) {
        _val = _val.slice(1,_val.length-1);
        if (_val.startsWith('http:') || _val.startsWith('https:')){
          //_val = '<a href="'+ _val + '" target=_blank>' + _val + '</a>';
          _val = <a href={_val} target={'_blank'}>{_val}</a>
        }
      } else if (!this.state.data_cat[cat][_key] && this.state.data_cat[cat][0]) {
        _val = JSON.stringify(this.state.data_cat[cat][0][_key]);
        for (let j=1; j<this.state.data_cat[cat].length; j++) {
          _val += ' | ' + JSON.stringify(this.state.data_cat[cat][j][_key])
        }
      }
//"token_classification": [
//     {
//       "classification_org": "Dacebook Inc",
//       "classification_type": "General",
//       "classification": "Currency Token",
//       "sub_classification": "-"
//     },
//     {
//       "classification_org": "Dacebook-Inc",

      //"token_classification": {
      //       "title": "Token Classification",
      //       "names": [
      //         [
      //           "classification_org",
      //           "Classifier Org"
      //         ],

      children.push(<td key={`dr_l_${i}`} style={{'width':'30%'}}>{_lbl}</td>);
      //children.push(<td key={`dr_k_${i}`} style={{'width':'30%'}}>{_key}</td>);
      children.push(<td key={`dr_v_${i}`} style={{'width':'8em'}}>{_val}</td>);

      table.push(<tr key={`${cat}_${i}`}>{children}</tr>)
    }
    return  <div className="col-md-12" key={`tokcat_${cat}`} id={cat}>
      <table className="table table-striped" style={{ marginTop : 60}}>
        <thead>
        <tr><th colSpan="2" className={"text-muted"}>{data_keys.keys[cat].title}</th></tr>
        </thead>
        <tbody id={'tokendata'}>
        {table}
        </tbody>
        <tfoot><tr><tf colSpan="2"><div><a href={'#'}>top</a></div></tf></tr></tfoot>
      </table>
    </div>
  }


  createTokenTable2 = (page, sort, filt) => {
    console.log('ctt2:', page, sort, filt);
    let _tns = [];
    if (page && parseInt(page)>=1 || sort && this.state.tokenListCurr[sort] || filt) {
      _tns = this.dacinListObject(page,sort,filt).slice(0)
    } else {
      _tns = this.state.tokenListCurr
    }

    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < _tns.length; i++) {
      let children = []
      //Inner loop to create children
      //for (let j = 0; j < 4; j++) {
      //  children.push(<td>{`Column ${j + 1}`}{_tns[i].name}</td>)
      //}
      children.push(<td key={`0_${i}`} style={{'width':'1em'}} className={"text-muted"}>{/*_tns[i].id_cc*/ (this.state.tokenListPageCurr - 1) * this.state.tokenListPageSize + i + 1 }</td>)
      children.push(<td key={`d_${i}`} style={{'width':'13em'}}><Link to={'/dacin/' + _tns[i].dacin}>{_tns[i].dacin}</Link></td>)
      children.push(<td key={`n_${i}`} style={{'width':'13em', 'whiteSpace':'nowrap'}}><img src={'/' + this.state.pathToTokens + '/32x32/' + _tns[i].id_cc + '.png'} alt={'[]'} style={{'paddingBottom':4, 'width':16, 'height':20}}/>&nbsp;{_tns[i].name}</td>)
      children.push(<td key={`s_${i}`} style={{'width':'8em'}}>{_tns[i].symbol}</td>)
      children.push(<td key={`r_${i}`} style={{'width':'1em'}}><img alt={''} style={{'width': '1em', display: localStorage.getItem(_tns[i].dacin) != null ? 'initial' : 'none'}} src={'/page_icon.png'} /></td>)
      children.push(<td key={`p1_${i}`} style={{'width':'8em'}}>{this.state.ticker1[_tns[i].symbol]?"$"+this.state.ticker1[_tns[i].symbol]["price_usd"]:""}</td>)
      children.push(<td key={`p2_${i}`} style={{'width':'8em'}}>{this.state.ticker2[_tns[i].symbol]?this.state.ticker2[_tns[i].symbol]["price_usd"]:""}</td>)
      children.push(<td key={`p3_${i}`} style={{'width':'8em'}}>{this.state.ticker3[_tns[i].symbol]?this.state.ticker3[_tns[i].symbol]["price_usd"]:""}</td>)
      //Create the parent and add the children
      //<li className="list-group-item">
      // <Link to={'/' + this.state.pathToTokens + '/' + _tns.t1.address}>{_tns.t1.name}</Link>
      // <img style={{'width': '1em', display: localStorage.getItem(_tns.t1.address) != null ? 'initial' : 'none'}} src={'/page_icon.png'} />
      // </li>
      table.push(<tr key={i}>{children}</tr>)
    }
    return table

  }


  resetInput = () => {
    document.getElementById('inputsearch').value = '';
    this.setState({ tokenListFilter: '', tokenListCurr: cccy_dacin_arr.data.slice(0), tokenListPageCurr: 1, tokenListPageMax: 1 + parseInt(cccy_dacin_arr.data.length/this.state.tokenListPageSize) });
  }


  handleChange = (e) => {
    var self = this;
    console.log('hoc: code', e.keyCode);
    console.log('hoc: value', e.target.value);

    // reset on backspace...
    if (e.target.value.length < this.state.tokenListFilter.length) {
      this.resetInput();
      return
    }
    else { // ...filter
      if (e.target.value) {
        document.getElementById('inputsearch').value = e.target.value;
        this.state.tokenListFilter = e.target.value.toLowerCase();

        //if (e.keyCode === 13) {
        //  console.log('enter');
        //}

        let _tns = [];
        _tns = self.state.tokenListCurr.slice(0).filter((value, index, array) => {
              return value.name.toLowerCase().startsWith(self.state.tokenListFilter);
            }
        );
        console.log('hc:', _tns.length);
        self.setState({tokenListCurr: _tns.slice(0), tokenListPageCurr: 1, tokenListPageMax: 1 + parseInt(_tns.length / self.state.tokenListPageSize)});
        document.getElementById('inputsearch').focus();
      }
    }
  }

  // ///////////////////////////////////////////////////////////////

  render() {

    let styleTopRight = {
      textAlign: 'right',
      paddingRight: 20
    };

    let styleDivButton = {
      /*display: 'flex',*/
      verticalAlign: 'top',
      position: 'relative'
    };

    let styleWidthCol1 = {
      width: 152
    };

    let styleHeaderFixed = {
      /*position: 'fixed',*/
      /*backgroundColor: '#222',*/
      marginTop: -20,
      width: '100%',
      zIndex: 1,
      paddingBottom: 10,
      borderBottom: '1px #444 solid'
    };

    let styleHeaderFixedPadding = {
      /*paddingTop: 120*/
      paddingTop: 20
    };

    const imgOnChain = <img className="Avatar"
                            src={'./chain_4_orange.png'}
                            alt="on-chain"
                            style={{display: 'none'}}
    />;

    const Title = () => {
      return (<div style={styleTopRight}>DACEBOOK Digital Asset Manager&trade;</div>)
    };

    /*
    const FooterTech = () => {
      return (<div className={"text-muted"} style={styleTopRight}>
        Web3 v{web3.version} |{' '}
        {web3.currentProvider.constructor.name} |{' '}
        {this.state.network}
      </div>)
    }
    */

    const InputSearch = () => {
      return (
          <input ref={(input) => { this.nameInput = input; }}
                 className="form-control form-control-sm"
                 type="text"
                 style={{'width':50, 'height':24 }}
                 id="inputsearch"
                 value={this.state.tokenListFilter}
                 onChange={this.handleChange}
                 disabled={this.state.tokenListPageCurr > 1 ? true : false}
          />
      )
    }

    const HomePage = () => {
      let _d = this.getDacin();
      return (
          <div>
            <Title />
            {/*<FooterTech />*/}
            <div style={{marginLeft: 3}}>HOMEPAGE</div>
            <div>
              <Link to={'/' + this.state.pathToTokens + '?page=1'}>Tokens</Link>
            </div>
            <div>{_d}</div>
          </div>);
    };

    const ApiDacin = () => {
      let _l = JSON.stringify(this.state.listingCmc);
      return(
          <pre>
            {_l}
          </pre>
      )
    }

    const PrintListing = () => {
      const _l = JSON.stringify(this.cccy_dacin);
      return(
          <pre>
            OUT:
            {_l}
          </pre>
      )
    }

    const TokenList = (match) => {
      console.log("tl:", match);
      console.log("tl: url:", match.url);
      this.state.address = '';
      this.state.verified = false;
      this.state.symbol = '';
      this.state.name = 'Loading contract data...';
      this.state.decimals = 0;
      this.state.totalSupply = 0;
      this.state.balanceOf = '';
      this.state.tokenLoaded = false;
      this.state.tokenLoadedFailed = false;
      this.state.countCompLoad = 0;
      this.state.stateRd = 0;

      let _p = -1;
      let _s = null;
      let _f = null;
      let _ss = qs.parse(match.location.search);
      if (match.location.search) {
        console.log('search:', qs.parse(match.location.search));
        let _pa = match.location.search.split('&');
        let _sp = _pa[0].split('=');
        if (!isNaN(_sp[1]))
        {
          _p = Math.max(0, parseInt(_sp[1]));
        }
        if (_pa[1] && _pa[1].split('=')[1]) {
          _s = _pa[1].split('=')[1];
        }
        //if (_pa[2] && _pa[2].split('=')[1]) {
        //  _f = _pa[2].split('=')[1];
        //  this.state.tokenListFilter = _f;
        //} else { this.state.tokenListFilter = '' }
      }

      return (
          <div>
            <Title />
            {/*<FooterTech />*/}
            <div style={{marginLeft: 3}}>TOKENLIST</div>
            <div className={"col-md-12"}>
              <table className={"table table-striped"} style={{'maxWidth':'60em'}}>
                <thead>
                {/*<tr className={"text-muted"}><th>#</th><th>DACIN</th><th>Name</th><th>Platform</th><th>Market Cap</th><th>Vol24</th><th>RD+</th></tr>*/}
                <tr className={"text-muted"}>
                  <th>
                    <Link to={'/' + this.state.pathToTokens + '?page=1'} onClick={ this.resetInput }>#</Link></th>
                  <th><Link to={'/' + this.state.pathToTokens + '?page=1&sort=dacin'}>DACIN &uarr;&darr;</Link></th>
                  <th style={{ 'display':'flex', 'borderBottomWidth':1,'paddingBottom':13 }}>
                    <Link to={'/' + this.state.pathToTokens + '?page=1&sort=name'} style={{'width':160}}>Name &uarr;&darr;</Link>
                    <InputSearch />
                    <Link to={'/' + this.state.pathToTokens + '?page=1'} onClick={ this.resetInput } style={{ 'marginLeft':4, 'pointerEvents': this.state.tokenListFilter?'inherit':'none', 'color': this.state.tokenListFilter?'#00bc8c':'#999' }}>&nbsp;X</Link>
                  </th>
                  <th><Link to={'/' + this.state.pathToTokens + '?page=1&sort=symbol'}>Symbol &uarr;&darr;</Link></th>
                  <th>+</th>
                  <th>Coinbase</th>
                  <th>Binance</th>
                  <th>Kraken</th>
                </tr>
                </thead>
                <tbody>
                {/*this.createTokenTable(_p)*/}
                {this.createTokenTable2(_p, _s, this.state.tokenListFilter)}
                </tbody>
              </table>
              <nav>
                <ul className={'pagination'}>
                  <li className={'page-item'}><Link className={'page-link'} style={{'paddingBottom':4}} to={'/' + this.state.pathToTokens + '?page=1' + (this.state.tokenListSortBy ? '&sort=' + this.state.tokenListSortBy : '')}><span style={{'fontSize': 'larger'}}>&#8676;</span></Link></li>
                  <li><Link className={'page-link'} to={'/' + this.state.pathToTokens + '?page=' + Math.max((this.state.tokenListPageCurr - 1), 1) + (this.state.tokenListSortBy ? '&sort=' + this.state.tokenListSortBy : '')}>&lt;&lt;</Link></li>
                  <li className={'disabled'}><Link className={'page-link'} to={'#'}>{this.state.tokenListPageCurr + ' of ' + this.state.tokenListPageMax}</Link></li>
                  <li><Link className={'page-link'} to={'/' + this.state.pathToTokens + '?page=' + Math.min((this.state.tokenListPageCurr + 1), this.state.tokenListPageMax) + (this.state.tokenListSortBy ? '&sort=' + this.state.tokenListSortBy : '')}>&gt;&gt;</Link></li>
                  <li><Link className={'page-link'} style={{'paddingBottom':4}} to={'/' + this.state.pathToTokens + '?page=' + this.state.tokenListPageMax + (this.state.tokenListSortBy ? '&sort=' + this.state.tokenListSortBy : '')}><span style={{'fontSize': 'larger'}}>&#8677;</span></Link></li>
                  <li><Link className={'page-link'} to={'/' + this.state.pathToTokens + '?page=' + (this.state.tokenListSortBy ? '&sort=' + this.state.tokenListSortBy : '')}>all</Link></li>
                </ul>
              </nav>
            </div>

          </div>);
    };

    const DacinNew = (p) => {
      console.log(this.state.countDacinNew);
      console.log(p);//.params);
      console.log(p.match.params);
      let _n = !p.match.params || !p.match.params.num || isNaN(p.match.params.num) ? 1 : p.match.params.num;
      //else {
      let _ds = [];
      if (this.state.countDacinNew === 2 || this.state.countDacinNew === 5) {
        for (let i = 0; i < Math.min(2000, parseInt(_n, 10)); i++) {
          _ds.push(this.getDacin());
          _ds.push("\n");
        }
      }
      this.state.countDacinNew += 1;
      //if (true || this.state.countDacinNew === 3) {
      return(<pre>{_ds}</pre>)
      //} else { return (false) }
      //}
      //return(<pre>{_ds}</pre>)
    }


    const TokenDetailOffChain = (match) => {
      // match: isExact: true
      //    params: {tid: "DA000043DGSVMF56"}
      //    path: "/dacin/:tid"
      //    url: "/dacin/DA000043DGSVMF56"
      console.log(match);
      console.log('td:', this.state.tokenLoaded, this.state.tokenLoadedFailed, this.state.verified, this.state.countCompLoad, this.state.stateRd);

      let self = this;
      let _tid = '';

      if (match.match.url.split("/")[1] === 'dacin'){

        //let _s = localStorage.getItem(match.match.params.tid);
        let _s = Object;
        if (this.state.countCompLoad === 0) {
          let _f = './' + match.match.params.tid + '.json';
          console.log('trying to get', _f);
          _s = require('./' + match.match.params.tid + '.json');
          //console.log(JSON.stringify(_s));
          this.state.dacin = match.match.params.tid;
        }

        if (!_s) { return(<div><div>dacin not found</div><div><Link to={'/' + this.state.pathToTokens}>back</Link></div></div>) }
        //console.log(_s, JSON.parse(_s).dacin);

        if (!match.match.isExact && match.location.pathname.split("/")[3] === 'json'){
          return (<div><pre>{JSON.stringify(_s, null, 2)}</pre></div>)
        }

        if (!match.match.isExact && match.location.pathname.split("/")[3] === 'xml'){
          var js2xmlparser = require("js2xmlparser");
          return (<div><pre>{js2xmlparser.parse("root", _s)}</pre></div>)
        }

        //if (_s && JSON.parse(_s).dacin === match.match.params.tid)
        if (_s.token_definition && _s.token_definition.dacin === match.match.params.tid)
        {
          console.log(_s.token_definition.dacin);
          this.state.dacin = match.match.params.tid;
          this.state.data_cat = _s;
        }

      }
      /*
      console.log('countCompLoad 1:', this.state.countCompLoad);
      if(this.state.countCompLoad == 1) {
        //this.setState({'dacin':this.state.dacin});
        console.log('countCompLoad 2:', this.state.countCompLoad);

        // self.loadRefDataByDacin(this.state.dacin);
        // //this.state.tokenLoaded = true;

        self.loadRefDataByDacinFile(this.state.dacin);


      }
      */
      if (this.state.countCompLoad > 25) { return false; }
      this.state.countCompLoad += 1;
      if (this.state.countCompLoad <= 1) { console.log('onEnter'); this.onEnter(); }

      console.log('rendering...',this.state.countCompLoad);

      return (<div>
        <Title />
        {/*<FooterTech />*/}

        <div style={styleHeaderFixed}>


          <h2>{this.state.name}</h2>

          <Link to={'/' + this.state.pathToTokens}>back</Link>
        </div>


        <div style={styleHeaderFixedPadding}>

          <div className="row" style={{display:'none'}}>
            <div className="col-md-6">
              <table className="table table-striped">
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Contract Information {imgOnChain}</th></tr>
                </thead>
                <tbody>
                <tr><td style={styleWidthCol1}>Platform:</td><td><a target={'_blank'} href={'https://etherscan.io/'}>Ethereum{this.state.platform}</a></td></tr>
                <tr><td style={styleWidthCol1}>Contract:</td><td><a target={'_blank'} href={"https://" + this.state.network + ".etherscan.io/address/" + _tid}>{_tid}</a></td></tr>
                <tr><td>Address:</td><td><a target={'_blank'} href={"https://" + this.state.network + ".etherscan.io/address/" + _tid}>{_tid}</a></td></tr>
                <tr><td>Balance:</td><td>{/*web3.utils.fromWei(this.state.balanceOf, 'ether')*/} Tokens</td></tr>
                <tr><td>Transactions:</td><td>2</td></tr>
                <tr><td>Verified:</td><td>{"" + this.state.verified}</td></tr>
                <tr><td>Source code</td><td><a target={'_blank'} href={"https://" + this.state.network + ".etherscan.io/address/" + {/*this.state.address*/} + _tid + "#code"}>view</a></td></tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table className="table table-striped">
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Token Information {imgOnChain}</th></tr>
                </thead>
                <tbody>
                <tr><td style={styleWidthCol1}>Name:</td><td>{this.state.name}</td></tr>
                <tr><td>Symbol:</td><td>{this.state.symbol}</td></tr>
                <tr><td>Interface Standard:</td><td>{this.state.standard}</td></tr>
                <tr><td>Total Supply:</td><td>{/*web3.utils.fromWei(""+this.state.totalSupply, 'ether')*/}</td></tr>
                <tr><td>Decimals:</td><td>{this.state.decimals}</td></tr>
                <tr><td>Address:</td><td><Link to={"https://" + this.state.network + ".etherscan.io/address/" + _tid}>{_tid}</Link></td></tr>
                <tr><td>Issue date:</td><td>Oct-11-2018 10:24:27 AM +UTC</td></tr>
                <tr><td>Transfers:</td><td>2</td></tr>
                <tr><td>Holders:</td><td>2</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={'row'}>{this.createTableDataSubLoopList()}</div>

          <div className={'row'}>&nbsp;</div>
          <div className={'row'}><a href={match.match.params.tid + '/json'}>{'API - JSON'}</a></div>
          <div className={'row'}><a href={match.match.params.tid + '/xml'}>{'API - XML'}</a></div>

          <div className="row">
            {/*
            <div className="col-md-6">
              <table className="table  table-striped">
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Additional Reference Data</th></tr>
                </thead>
                <tbody>
                <tr><td style={styleWidthCol1}>Storage address:</td><td>
                  <div style={styleDivButton}>
                    <Link to={''} style={{ display: this.state.address_ref === '' ? 'none' : 'inherit' }} id="RdRtL"><span id="RdRt">{this.state.address_ref}</span></Link>
                    <button type="button" id="btn_create" className="btn btn-warning" style={{ display: this.state.address_ref === '' ? 'initial' : 'none' }} onClick={this.onCreate.bind(this)}>create </button>
                    <div id="btnCreateLoader" className="loader" style={{ left: -18, top: 4 }} />
                  </div>
                </td></tr>
                <tr><td>DACIN:</td><td><a href=""><span id="RdDc">{this.state.dacin}</span></a></td></tr>
                <tr><td>Token class:</td><td><input className="form-control ipt-rdt" id="RdTc" onClick={this.pasteText.bind(null, 'RdTc','Payment token (EP01)')} /></td></tr>
                <tr><td>Token sub-class:</td><td><input className="form-control ipt-rdt" id="RdTsc" onClick={this.pasteText.bind(null, 'RdTsc','Unpegged payment token (EP0101)')} /></td></tr>
                <tr><td>Official website:</td><td><input className="form-control ipt-rdt" id="RdWs" onClick={this.pasteText.bind(null, 'RdWs','https://pong25token.io')} /></td></tr>
                <tr><td>White paper:</td><td>
                  <div>
                    <input className="form-control ipt-rdt" id="IRdWp" type="file" />
                    <label className="ipt-rdt" id="RdWp" htmlFor={'IRdWp'} onClick={this.pasteText.bind(null, 'RdWp','https://pong25token.io/whitepaper.pdf')} />
                  </div>
                </td></tr>
                <tr><td>Legal Entity ID (LEI):</td><td><input className="form-control ipt-rdt" id="RdLa" onClick={this.pasteText.bind(null, 'RdLa','529900SEOICVR2VM6Y05')} /></td></tr>
                <tr><td>Last update:</td><td><div id="RdLu">{this.state.lastUpdate}</div></td></tr>
                <tr><td>Transaction:</td><td><div style={{ display: 'grid' }}><a href=""><span id="RdTx">{this.state.lastTx}</span></a></div></td></tr>
                <tr><td>&nbsp;</td><td align="right">
                  <div>
                    <button type="button" id="btn_save" className="btn btn-primary ipt-rdt" onClick={this.onSaveByDacin}>save <div id="btnSaveLoader" className="loader" /></button>
                  </div>
                </td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-striped">
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Transfers and Holders {imgOnChain}</th></tr>
                </thead>
                <tbody>
                <tr><td style={styleWidthCol1}>Transfers:</td><td>Tx, From, To, ...</td></tr>
                <tr><td>Holders:</td><td>Ranking (total + percent)</td></tr>
                <tr><td>Free Flow:</td><td>Tokens % not held by owner or creator</td></tr>
                <tr><td>data_ref:</td><td><span id={'dataRef'}></span></td></tr>
                <tr><td>data_mkt:</td><td><span id={'dataMkt'}></span></td></tr>
                </tbody>
              </table>
            </div>
            */}

            {this.createTableDataSubLoop()}

            {/*
            <div className="col-md-12">
              <table className="table table-striped">
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Reference Data</th></tr>
                </thead>
                <tbody>
                {this.createTableDataRef()}
                </tbody>
              </table>
            </div>

            <div className="col-md-12">
              <table className="table table-striped" style={{ marginTop : 60}}>
                <thead>
                <tr><th colSpan="2" className={"text-muted"}>Market Data {imgOnChain}</th></tr>
                </thead>
                <tbody>
                {this.createTableDataMkt()}
                </tbody>
              </table>
            </div>
            */}
          </div>

          <hr />

          <h5>{this.state.message}</h5>

          <hr />

        </div>

      </div>);
    };


    return (
      <div className="App">
        {/*
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        */}
        <Router>
          <main>
            {/* Renders with quiknode:   <div>{this.state.owner}</div> */}
            <Route path={"/"} exact component={HomePage} />
            <Route path={"/" + this.state.pathToTokens} exact component={TokenList} />
            {/*<Route path={"/" + this.state.pathToTokens +"/:tid"} component={TokenDetail} />*/}
            {<Route path={"/dacin/:tid"} component={TokenDetailOffChain} />}
            <Route path={"/tool/dacin/new/"} component={DacinNew} />
            <Route path={"/tool/dacin/new/:num"} component={DacinNew} />

            <Route path={"/api/v1/dacin/json/:dacin"} component={ApiDacin} />
            <Route path={"/api/v1/dacin/xml/:dacin"} component={ApiDacin} />
            <Route path={"/api/v1/dacin/json2/"} component={PrintListing} />
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
