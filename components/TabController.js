import React from "react";
import PubSub from "pubsub-js";

export default class AbasParaNavegacao extends React.Component {
  constructor() {
    super();

    this.state ={
      painelAtivo: 0,
      menuVisivel: false
    };
  }

  componentDidMount() {
    this.navegador = this.props.navegador;

    PubSub.subscribe(this.props.navegador + '-painel-ativado', (s, n) => {
      this.setState({
        painelAtivo: n
      })
    });
  }

  onBotaoClicado(index) {
    if (this.state.painelAtivo === index) {
      this.setState(prevState => {
        return { menuVisivel: !prevState.menuVisivel }
      });
    } else {
      PubSub.publish(this.props.navegador + '-ativar-painel', index);
      this.setState(prevState => {
        return { menuVisivel: !prevState.menuVisivel }
      });
    }
  }

  estiloResponsivoBotoes(index) {
    if (window.innerWidth >= 720) {
      return { display: 'block' }
    }

    if (this.props.responsivo === 'cascata') {
      return {
        order: this.state.painelAtivo === index ? 1 : 2,
        display: (this.state.painelAtivo === index || this.state.menuVisivel) ? 'flex' : 'none'
      }
    } else {
      return {}
    }
  }

  estiloResponsivoSpan(index) {
    if (window.innerWidth >= 720) {
      return { display: 'none' }
    }

    if (this.props.responsivo === 'cascata') {
      return {
        display: (this.state.painelAtivo === index) ? 'block' : 'none'
      }
    } else {
      return {
        display: 'none'
      }
    }
  }

  render() {
    return <div className={'navegador'}>
      <div>
        {
          this.props.abas.map((aba, index) => {
            return <button
              key={index}
              onClick={() => this.onBotaoClicado(index)}
              className={
                this.state.painelAtivo === index ? 'btn-ativo' : ''
              }
              style={ this.estiloResponsivoBotoes(index) }
            >
              {aba}
              <span
                className={'icon-seta-baixo'}
                style={ this.estiloResponsivoSpan(index) }
              />
            </button>
          })
        }
      </div>
      {
        this.props.children
      }
    </div>
  }
};
