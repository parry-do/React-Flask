import mobiscroll from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

mobiscroll.settings = {
    theme: 'ios',
    themeVariant: 'light'
};

const signUpBtn = [{
    text: 'Sign Up',
    handler: 'set'
}];

const logInBtn = [{
    text: 'Log In',
    handler: 'set'
}];

class App extends React.Component {
    showRegister = () => {
        this.refs.register.instance.show();
    }
    
    showLogin = () => {
        this.refs.login.instance.show();
    }
    
    hideLogin = () => {
        this.refs.login.instance.hide();
    }
    
    render() {
        return (
            <div>
                <mobiscroll.Form>
                    <mobiscroll.FormGroup>
                        <div className="mbsc-btn-group-block">
                            <mobiscroll.Button onClick={this.showRegister}>Show register form</mobiscroll.Button>
                            <mobiscroll.Button onClick={this.showLogin}>Show login form</mobiscroll.Button>
                        </div>
                    </mobiscroll.FormGroup>
                </mobiscroll.Form>
                <mobiscroll.Popup
                    ref="register"
                    display="center"
                    buttons={signUpBtn}
                >
                    <mobiscroll.Form>
                        <mobiscroll.FormGroup inset>
                            <mobiscroll.Input type="text" name="name" placeholder="Name" />
                            <mobiscroll.Input type="text" name="email" placeholder="Email" />
                            <mobiscroll.Input name="password" type="text" placeholder="Password" passwordToggle="true" iconShow="eye" iconHide="eye-blocked" />
                        </mobiscroll.FormGroup>
                    </mobiscroll.Form>
                </mobiscroll.Popup>
                <mobiscroll.Popup
                    ref="login"
                    display="center"
                    buttons={logInBtn}
                >
                    <mobiscroll.Form>
                        <mobiscroll.FormGroup inset>
                            <mobiscroll.Input type="text" name="email" placeholder="Email" />
                            <mobiscroll.Input name="password" type="text" placeholder="Password" passwordToggle="true" iconShow="eye" iconHide="eye-blocked" />
                        </mobiscroll.FormGroup>
                        <div className="mbsc-align-center">or log in with one of your existing accounts</div>
                        <mobiscroll.FormGroup inset>
                            <mobiscroll.Button onClick={this.hideLogin} className="md-social-btn mbsc-btn-block" style={{background:'#3c5c9a', color:'#fff'}}>
                                <span className="mbsc-ic mbsc-ic-ion-social-facebook mbsc-pull-left"></span>
                                Log in with Facebook
                            </mobiscroll.Button>
                            <mobiscroll.Button onClick={this.hideLogin} className="md-social-btn mbsc-btn-block" style={{background:'#28aae1', color:'#fff'}}>
                                <span className="mbsc-ic mbsc-ic-fa-twitter mbsc-pull-left"></span>
                                Log in with Twitter
                            </mobiscroll.Button>
                            <mobiscroll.Button onClick={this.hideLogin} className="md-social-btn mbsc-btn-block" style={{background:'#d34230', color:'#fff'}}>
                                <span className="mbsc-ic mbsc-ic-fa-google mbsc-pull-left"></span>
                                Log in with Google
                            </mobiscroll.Button>
                        </mobiscroll.FormGroup>
                    </mobiscroll.Form>
                </mobiscroll.Popup>
            </div>
        );
    }    
}