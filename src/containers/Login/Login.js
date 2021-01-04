import React, { memo } from 'react';

import styles from './Login.module.css';
import { Label, Input, Select } from 'containers/Controller'
import { Moon, Sun } from 'components/Icons';

export const Login = memo((props) => {
  const { login, setTheme } = props
  const { version, languages, serverSide } = props.session
  const { username, database } = props.data
  const { theme } = props
  return (
    <div className={styles.modal}>
      <div className={styles.middle}>
        <div className={`${styles.dialog} ${theme}`} >
          <div className={`${"row primary"} ${styles.title}`} >
            <div className="cell" >
              <Label text="title_login" />
            </div>
            <div className={`${"cell"} ${styles.version}`} >
              <Label value={"v"+version} />
            </div>
          </div>
          <div className="row full section-small" >
            <div className="row full section-small" >
              <div className="row full" >
                <div className="padding-normal s12 m4 l4" >
                  <Label text="login_username" className="bold" />
                </div>
                <div className="container s12 m8 l8" >
                  <Input id="username" type="text" className="full"
                    keys={["login","username"]} onEnter={login} />
                </div>
              </div>
              <div className="row full" >
                <div className="padding-normal s12 m4 l4" >
                  <Label text="login_password" className="bold" />
                </div>
                <div className="container s12 m8 l8" >
                  <Input id="password" type="password" className="full" 
                    keys={["login","password"]} onEnter={login} />
                </div>
              </div>
            </div>
            <div className="row full section-small" >
              <div className="row full" >
                <div className="padding-normal s12 m4 l4" >
                  <Label text="login_database" className="bold" />
                </div>
                <div className="container s12 m8 l8" >
                  <Input id="database" type="text" className="full"
                    keys={["login","database"]} onEnter={login} />
                </div>
              </div>
              {(!serverSide)?<div className="row full" >
                <div className="padding-normal full" >
                  <Label text="login_server" className="bold" />
                </div>
                <div className="container full" >
                  <Input id="server" type="text" className="full"
                    keys={["login","server"]} />
                </div>
              </div>:null}
            </div>
          </div>
          <div className={`${"row full section-small secondary-title"}`} >
            <div className="container section-small s6 m6 l6" >
              <button className="border-button" onClick={setTheme} >
                {(theme === "dark")?<Sun />:<Moon />}
              </button>
              <Select id="lang" options={languages} 
                keys={["current","lang"]} />
            </div>
            <div className="container section-small s6 m6 l6" >
              <button id="login" autoFocus
                disabled={((!username || (String(username).length===0) 
                  || !database || (String(database).length===0))?"disabled":"")} 
                className="primary full"
                onClick={login} >
                <Label text="login_login"  />
              </button>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.theme === nextProps.theme)
  )
})
