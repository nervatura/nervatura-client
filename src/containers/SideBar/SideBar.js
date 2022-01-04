import { memo } from 'react';
import PropTypes from 'prop-types';

import Edit from 'components/SideBar/Edit'
import Search from 'components/SideBar/Search'
import Setting from 'components/SideBar/Setting'

export const SideBarComponent = ({
  data, module, login, username, forms,
  onGroup, onMenu, getText
}) => {
  if(data.module === "edit"){
    return <Edit side={data.side}
      edit={data.edit} module={module} forms={forms}
      newFilter={login.edit_new} auditFilter={login.audit_filter}
      onGroup={onGroup} onMenu={onMenu} getText={getText} />
  }
  if(data.module === "setting"){
    return <Setting side={data.side} 
      module={module} auditFilter={login.audit_filter} username={username}
      onGroup={onGroup} onMenu={onMenu} getText={getText} />
  }
  return <Search side={data.side} 
    groupKey={module.group_key} auditFilter={login.audit_filter} 
    onGroup={onGroup} onMenu={onMenu} getText={getText} />
}

SideBarComponent.propTypes = {
  data: PropTypes.shape({
    side: Search.propTypes.side,
    module: PropTypes.string.isRequired,
    edit: PropTypes.bool.isRequired
  }).isRequired, 
  module: PropTypes.object.isRequired, 
  login: PropTypes.object.isRequired, 
  username: PropTypes.string,
  forms: PropTypes.object.isRequired,
  onGroup: PropTypes.func,
  onMenu: PropTypes.func,
  getText: PropTypes.func
}

SideBarComponent.defaultProps = {
  data: {
    side: Search.defaultProps.side,
    module: "search",
    edit: false
  }, 
  module: {}, 
  login: {}, 
  username: undefined,
  forms: {},
  onGroup: undefined,
  onMenu: undefined,
  getText: undefined
}

export default memo(SideBarComponent, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.module === nextProps.module)
  )
})

