import React from "react";
import PubSub from "pubsub-js";

export default class DropdownMenu extends React.Component {
  montarBotaoParaRolagem(config, index) {
    return <button
      className={'ead-link-cabecalho'}
      key={index}
      onClick={() => {
        PubSub.publish(config.navegador + '-rolagem', config.secao);
      }}
    >
      {
        config.rotulo
      }
    </button>
  }

  montarBotaoParaNavegacaoHorizontal(config, index) {
    return <a
      className={'ead-link-cabecalho'}
      key={index}
      onClick={() => {
        PubSub.publish(config.navegador + '-navegar-h', config.secao);
      }}
    >
      {config.rotulo}
    </a>
  }

  render() {
    return <div
      className={'menuSuspensoEmbrulho'}
    >
      <div className={'menuSuspenso'}>
        {
          this.props.config.map((item, index) => {
            switch (item.acao) {
              case "rolagem":
                return this.montarBotaoParaRolagem(item, index);
              case "navegar-para":
                return this.montarBotaoParaNavegacaoHorizontal(item, index);
              default:
                throw new Error('Ação inválida');
            }
          })
        }
      </div>
    </div>
  }
}
