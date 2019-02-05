import React from "react";
import PubSub from "pubsub-js";
import {DropdownMenu} from "./DropdownMenu";

export default class Cabecalho extends React.Component {

  componentWillMount() {
    this.menuMobile = document.getElementsByClassName('cabecalho--btnConteiner');

    this.menusSuspensos = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 720) this.mostrarMenuMobile();
      else this.esconderMenuMobile();
    });
  }

  componentDidMount() {
    if (window.innerWidth < 720) this.esconderMenuMobile();
  }

  mostrarMenuMobile() {
    this.menuMobile[0]['style']['opacity'] = '1';
    this.menuMobile[0]['style']['visibility'] = 'visible';
  }

  esconderMenuMobile() {
    this.menuMobile[0]['style']['opacity'] = '0';
    this.menuMobile[0]['style']['visibility'] = 'hidden';
  }

  montarLinkParaRolagem(config, index) {
    return <button
      className={'cabecalho--btnAcao'}
      key={index}
      onClick={() => {
        PubSub.publish(config.navegador + '-rolagem', config.secao);
      }}
    >
      {config.rotulo}
    </button>
  }

  montarLinkParaNavegacaoHorizontal(config, index) {
    return <button
      className={'cabecalho--btnAcao'}
      key={index}
      onClick={() => {
        PubSub.publish(config.navegador + '-navegar-h', config.secao);
      }}
    >
      {config.rotulo}
    </button>
  }

  montarLinkParaMenuSuspenso(config, index) {
    return <div className={'cabecalho--menuSuspensoConteiner'}>
      <button
        key={index}
        className={'cabecalho--btnAcao'}
      >
        {config.rotulo}
      </button>
      <DropdownMenu
        index={config.menu}
        config={this.menusSuspensos[config.menu]['props']['config']}
      />
    </div>
  }

  montarLinkParaSumario(index) {
    return <button
      className={'cabecalho--btnAcao'}
      key={index}
      onClick={() => {
        PubSub.publish('toggle-sumario', true);
      }}
    >
      SUMÁRIO
    </button>
  }

  render() {
    return <div className={'cabecalho'}>
      <button
        className={'cabecalho--btnMenuMobile icon-menu'}
        onClick={() => {
          this.mostrarMenuMobile();
        }}
      >
      </button>
      <span className={'logo'}><img src={marcaNte} alt={'logo do NTE'}/></span>
      <div
        className={'cabecalho--btnConteiner'}
      >
        {
          this.props.config.map((item, index) => {
            switch (item.acao) {
              case "rolagem":
                return this.montarLinkParaRolagem(item, index);
              case "menu-suspenso":
                return this.montarLinkParaMenuSuspenso(item, index);
              case "navegar-para":
                return this.montarLinkParaNavegacaoHorizontal(item, index);
              case "toggle-sumario":
                return this.montarLinkParaSumario(index);
              default:
                throw new Error('Ação inválida');
            }
          })
        }
      </div>
      <InfoNavegacao />
    </div>
  }
}
