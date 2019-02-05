import React from "react";
import PubSub from "pubsub-js";

export default class HNav extends React.Component {
  constructor() {
    super();

    this.state = {
      painelAtivo: 0,
      alturaNavegador: 100
    };
  }

  componentWillMount() {
    for (let i = 0; i < this.props.children.length; i++) {
      this["secao-" + i] = React.createRef();
    }
  }

  componentDidMount() {
    this.setState({
      alturaNavegador: this["secao-" + 0].current.clientHeight
    });

    PubSub.subscribe(this.props.id + '-ativar-painel', (s, n) => {
      this.pularParaPainel(n);
    });


  }

  mudarPainel(inc) {
    this.setState(
      prevState => {
        this.proximoPainel = prevState.painelAtivo + inc;

        if (this.proximoPainel < 0) return;
        if (this.proximoPainel >= this.props.children.length) return;

        this.proximaAltura = this[
        "secao-" + this.proximoPainel
          ].current.clientHeight;

        return {
          painelAtivo: this.proximoPainel
        };
      },
      () => {
        this.setState({
          alturaNavegador: this.proximaAltura
        });
      }
    );
  }

  pularParaPainel(painel) {
    this.proximoPainel = parseInt(painel);

    if (this.proximoPainel < 0) return;
    if (this.proximoPainel >= this.props.children.length) return;
    if (painel === "") return;

    this.proximaAltura = this[
    "secao-" + this.proximoPainel
      ].current.clientHeight;

    this.setState(
      {
        painelAtivo: this.proximoPainel
      },
      () => {
        this.setState({
          alturaNavegador: this.proximaAltura
        });

        PubSub.publish(this.props.id + '-painel-ativado', painel);
      }
    );
  }

  determinarPosicaoPainel(index) {
    if (index === this.state.painelAtivo) return 0;
    if (index > this.state.painelAtivo) return "100%";
    if (index < this.state.painelAtivo) return "-100%";
  }

  componentDidUpdate() {
    if (
      !this.state.alturaNavegador ===
      this["secao-" + this.state.painelAtivo].current.clientHeight
    ) {
      this.setState({
        alturaNavegador: this["secao-" + this.state.painelAtivo].current
          .clientHeight
      });
    }
  }

  render() {
    if (!Array.isArray(this.props.children))
      throw new Error(
        "Navegador horizontal deve receber mais de um elemento filho"
      );

    return (
      <div
        className={"navegador-horizontal-refac"}
        style={this.props.style}
      >
        <div className="painel-botoes-nav-horizontal-refac">
          <button
            className={'icon-seta-esquerda'}
            onClick={evt => {
              this.mudarPainel(-1);
            }}
          >
          </button>
          <button
            className={'icon-seta-direita'}
            onClick={evt => {
              this.mudarPainel(1);
            }}
          >
          </button>
        </div>
        <div
          className="conteiner-paineis-refac"
          style={{
            height: this.state.alturaNavegador
          }}
        >
          {this.props.children.map((child, index) => {
            return (
              <div
                key={index}
                ref={this["secao-" + index]}
                className={"painel-nav-horizontal-refac " + child.props.className}
                style={{
                  width: "100%",
                  transform:
                    "translateX(" +
                    this.determinarPosicaoPainel(index) +
                    ")"
                }}
              >
                {child.props.children}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
