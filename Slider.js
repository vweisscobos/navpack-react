import React from "react";

export class Slider extends React.Component {
  constructor() {
    super();

    this.state = {
      painelAtivo: 0,
      mounted: false
    };

    this.slider = React.createRef();
  }

  componentDidMount() {
    this.setState({
      mounted: true
    });

    setInterval(() => {
      this.deslizarParaOProximoPainel()
    }, 3000 );
  }

  pegarOffsetEsquerdo(index) {
    if (this.state.painelAtivo === index) { return 0 }
    else if (this.state.painelDesativando === index) {
      return -this.slider.current.clientWidth;
    }
    else { return this.slider.current.clientWidth }
  }

  deslizarParaOProximoPainel() {
    if (!this.state.mounted) return;

    this.setState(prevState => {
      if (prevState.painelAtivo === this.props.children.length - 1) {
        return {
          painelAtivo: 0,
          painelDesativando: prevState.painelAtivo
        }
      } else {
        return {
          painelAtivo: prevState.painelAtivo + 1,
          painelDesativando: prevState.painelAtivo
        }
      }
    }, this.retornarPainelDesativado());
  }

  retornarPainelDesativado() {
    setTimeout(this.setState({
      painelDesativado: null
    }), 1000)
  }

  pegarZIndex(index) {
    if (this.state.painelAtivo === index) { return 10; }
    else if (this.state.painelDesativando === index) { return 5; }
    else { return 1; }
  }

  render() {
    return <div
      id={this.props.id}
      ref={this.slider}
      className={[
        "ead-slider",
        this.props.className
      ].join(" ")}
      style={{
        ...this.props.style
      }}
    >
      {
        this.props.children.map((child, index) => {
          return <div
            key={index}
            className={'ead-slider-painel'}
            style={{
              zIndex: this.pegarZIndex(index),
              left: this.state.mounted ? this.pegarOffsetEsquerdo(index) : null
            }}
          >
            {child}
          </div>
        })
      }
      {
        this.props.conteudoFixo()
      }
    </div>
  }
}
