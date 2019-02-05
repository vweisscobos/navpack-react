import React from "react";
import PubSub from "pubsub-js";

export default class VNav extends React.Component {

  constructor() {
    super();

    this.state = {
      corBotoes: 'white'
    }
  }

  componentDidMount() {
    let menu = document.getElementsByClassName('cabecalho--btnConteiner');

    this.setState({
      corBotoes: this.props.corBotoes[0]
    });

    PubSub.subscribe(this.props.id + '-rolagem', (s, secao) => {
      if (this.scrollInterval) clearInterval(this.scrollInterval);
      this.scroll(this['secao_' + secao]['offsetTop']);

      if (window.innerWidth < 720) {
        for (let i = 0; i < menu.length; i++) {
          menu[i]['style']['opacity'] = '0';
          menu[i]['style']['visibility'] = 'hidden';
        }
      }
    });

    window.addEventListener('wheel', ( ) => {
      if (this.scrollInterval) clearInterval(this.scrollInterval);
    });
    this.navegador.addEventListener('scroll', () => {
      let i = this.pegarSecaoAtualInferior();

      this.setState({
        corBotoes: this.props.corBotoes[i]
      });
    });
  }

  scroll(pos) {
    let final = pos;
    let inicial = this.navegador.scrollTop;
    let delta = final - inicial;
    let incremento = delta > 0 ? 1 : -1;

    if (this.navegador.scrollTop === final) return;

    this.scrollInterval = setInterval(() => {
      this.navegador.scrollTop = this.navegador.scrollTop + incremento * 25;

      if (this.navegador.scrollTop === 0) {
        clearInterval(this.scrollInterval);
      } else if (this.navegador.scrollHeight - (this.navegador.scrollTop + this.navegador.clientHeight) <= 1) {
        clearInterval(this.scrollInterval);
      } else if (delta < 0 && this.navegador.scrollTop <= final) {
        clearInterval(this.scrollInterval);
      } else if (delta > 0 && this.navegador.scrollTop >= final) {
        clearInterval(this.scrollInterval);
      } else if (this.navegador.scrollHeight - this.navegador.scrollTop <=  this.navegador.clientHeight) {
        clearInterval(this.scrollInterval);
      }
    }, 1);
  }

  pegarSecaoAtualDoTopo() {
    let posicaoScroll = this.navegador.scrollTop,
      secaoAtual,
      ultimaSecao = this.props.children.length - 1;

    for (let i = 0; i < this.props.children.length; i++) {
      if (posicaoScroll >= this["secao_" + ultimaSecao]["offsetTop"]) {
        secaoAtual = ultimaSecao;
      } else if (
        posicaoScroll >= this["secao_" + i]["offsetTop"] &&
        posicaoScroll < this["secao_" + (i + 1)]["offsetTop"]
      ) {
        secaoAtual = i;
      }
    }

    return secaoAtual;
  }

  pegarSecaoAtualInferior() {
    let posicaoScroll = this.navegador.scrollTop + window.innerHeight - (window.innerHeight/100) * 8,
      secaoAtual,
      ultimaSecao = this.props.children.length - 1;

    for (let i = 0; i < this.props.children.length; i++) {
      if (posicaoScroll < 50) {
        secaoAtual = 0;
      } else if (
        posicaoScroll >= this["secao_" + ultimaSecao]["offsetTop"] + 200
      ){
        secaoAtual = ultimaSecao
      } else if (
        posicaoScroll >= this["secao_" + i]["offsetTop"] + 200 &&
        posicaoScroll < this["secao_" + (i + 1)]["offsetTop"] + 200
      ) {
        secaoAtual = i;
      }
    }

    return secaoAtual;
  }

  // pegarOffsets() {
  //   let offsets = this.props.children.map((child, index) => {
  //     return this["secao_" + index]["offsetTop"];
  //   });
  //
  //   return offsets;
  // }

  navegarParaCima() {
    if (this.scrollInterval) clearInterval(this.scrollInterval);

    let secaoAtual = this.pegarSecaoAtualDoTopo() || 0;

    if (secaoAtual === 0) {
      this.scroll(0);
    } else {
      this.scroll(this["secao_" + (secaoAtual - 1)]["offsetTop"]);
    }
  }

  navegarParaBaixo() {
    if (this.scrollInterval) clearInterval(this.scrollInterval);

    let secaoAtual = this.pegarSecaoAtualDoTopo() || 0;

    if (secaoAtual === this.props.children.length - 1) {
      return;
    } else {
      this.scroll(this["secao_" + (secaoAtual + 1)]["offsetTop"]);
    }
  }

  render() {
    return (
      <div
        id={this.props.id}
        className="ead-navegador-vertical-container"
        style={{
          ...this.props.style
        }}
      >
        <div className="ead-botoes-navegador-vertical">
          <button
            onClick={() => this.navegarParaCima()}
            style={{
              color: this.state.corBotoes
            }}
          >
            <span className="icon-flecha-circulo-cima" />
          </button>
          <button
            onClick={() => this.navegarParaBaixo()}
            style={{
              color: this.state.corBotoes
            }}
          >
            <span className="icon-flecha-circulo-baixo" />
          </button>
        </div>
        <div
          ref={el => {
            this.navegador = el;
          }}
          style={{
            height: "100%"
          }}
          className="ead-navegador-vertical"
        >
          {this.props.children.map((child, index) => {
            return (
              <div
                className="secao"
                key={index}
                ref={secao => {
                  this["secao_" + index] = secao;
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
