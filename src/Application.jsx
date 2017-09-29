import React, {PropTypes} from 'react'
import ApplicationLayout from './components/ApplicationLayout'
import DocumentContainer from './containers/DocumentContainer'
import DocumentListContainer from './containers/DocumentListContainer'

import domtoimage from 'dom-to-image'; 
import FileSaver from 'file-saver';

const renderShadows = () =>{
  const shadows = [...document.getElementsByClassName('container')] ;
    shadows.forEach(shadow=>{
      const name = shadow.dataset.name;
      const scale = shadow.dataset.scale;
      domtoimage.toBlob(shadow).then(blob=>{
        FileSaver.saveAs(blob, `${name}@${scale}x.png`);
    });
  });
};

const Input = ({label, name, value, onChanged}) => (
  <div>
  <span >{label}:</span>
  <input type={'text'} value={value} onChange={(e)=> onChanged(e, name)} />
</div>
);

const calculateOffsets = ({ spread, blur, vShadow, hShadow, height, width })=>{
  const s = parseInt(spread) || 0;
  const b = parseInt(blur) || 0;
  const v = parseInt(vShadow) || 0;
  const h = parseInt(hShadow) || 0;

  const top = s + (b) - v;
  const left = s + (b) - h;
  const bottom = s + (b) + v;
  const right = s + (b) + h;

  return { top, left, bottom, right };
}

class Shadow extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    const spread = parseInt(this.props.spread) || 0;
    const blur = parseInt(this.props.blur) || 0;
    const vOffset = parseInt(this.props.vShadow) || 0;
    const hOffset = parseInt(this.props.hShadow) || 0;
    const h = parseInt(this.props.height) || 0;
    const w = parseInt(this.props.width) || 0;

    const { top, left, bottom, right } = calculateOffsets(this.props);
   
    const width =  w + left + right;
    const height = h + top + bottom;
    const scale =this.props.scale;

    const containerStyle = {
      display: 'block',
      width: width * scale,
      height: height * scale,
      paddingTop: top * scale,
      paddingBottom: bottom * scale,
      paddingLeft: left * scale,
      paddingRight: right * scale,
      //border: 'solid 1px red',
    }

    const style = {
      width: w,
      height: h,
      backgroundColor: 'transparent',
      boxShadow: `${this.props.hShadow}px ${this.props.vShadow}px ${this.props.blur}px ${this.props.spread}px ${this.props.color}`,
      transformOrigin: 'top left',
      transform: `scale(${this.props.scale})`,
      borderRadius: `${this.props.borderRadius}`
    }

    return (
      <div className={'container'} data-name={this.props.name.trim()} data-scale={(this.props.scale + '').trim()} style={containerStyle}>
        <div style={style}/> 
      </div>
    )
  }

  static defaultProps = {
    scale: 1,
    hShadow: 0,
    vShadow: 0,
    blur: 0, 
    spread: 0,
    color: ''
  }
}

class Form extends React.Component
{
  constructor(props){
    super(props)
    this.state = { 
      styleText: '',
      
        scales: '0.75, 1, 1.5, 2, 3, 3.5',
        dpi: 160,
        shadow: {
          name: 'shadow',
          width: 100,
          height: 100,
          borderRadius: 0,
          hShadow: 0,
          vShadow: 0,
          blur: 10,
          spread: 0,
          color: 'rgba(0,0,0,.2)',
          style: '',
        }
    }
  }

   textChanged(e, type){
     const value = e.target.value;

     this.setState(
       {...this.state,

          [type]: value
        }
      );
   }

   shadowChanged(e, type){
    const value = e.target.value;

    this.setState(
      {...this.state,
       shadow: {
         ...this.state.shadow,
        [type]: value
        
       }
       }
     );
  }

  render(){
    let { top, left, bottom, right } = calculateOffsets(this.state.shadow);
    top = Math.max(0, top);
    left = Math.max(0, left);
    bottom = Math.max(0, bottom);
    right = Math.max(0, right);

    var imageCapInsetText = `<ImageCapInset source={require('./${this.state.shadow.name}.png')} height={${this.state.shadow.height}} width={${this.state.shadow.height}} capInsets={{ top: ${top}, right: ${right}, left: ${left}, bottom: ${bottom} }} />`
    return (
      <div>
        <Input label={'style'} name={'style'} value={this.state.shadow.style} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'horizontal-shadow'} name={'hShadow'} value={this.state.shadow.hShadow} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'vertical-shadow'} name={'vShadow'} value={this.state.shadow.vShadow} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'blur'} name={'blur'} value={this.state.shadow.blur} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'spread'} name={'spread'} value={this.state.shadow.spread} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'color'} name={'color'} value={this.state.shadow.color} onChanged={(e,name)=> this.shadowChanged(e,name)}/>

        <Input label={'border-radius'} name={'borderRadius'} value={this.state.shadow.borderRadius} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'width'} name={'width'} value={this.state.shadow.width} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'height'} name={'height'} value={this.state.shadow.height} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <Input label={'scales'} name={'scales'} value={this.state.scales} onChanged={(e,name)=> this.textChanged(e,name)}/>
        <Input label={'dpi'} name={'dpi'} value={this.state.dpi} onChanged={(e,name)=> this.textChanged(e,name)}/>
        <Input label={'name'} name={'name'} value={this.state.shadow.name} onChanged={(e,name)=> this.shadowChanged(e,name)}/>
        <div>
          <span>{imageCapInsetText}</span>
        </div>
        <button onClick={()=> renderShadows()}>Render</button>
        <div style={{marginLeft: 50}}>
          {this.state.scales.split(',').map(s=> <Shadow key={s} scale={s} {...this.state.shadow} />)}
        </div>
    </div>
    );
  }
}



// Application is the root component for your application.
export default function Application(props) {
  return <Form/>;
}
Application.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}






// Define this as a separate function to allow us to use the switch statement
// with `return` statements instead of `break`
const selectChildContainer = props => {
  const location = props.state.navigation.location
  
  let child
  switch (location.name) {
    case 'documentEdit':        
      child = <DocumentContainer {...props} id={location.options.id} />
    case 'documentList':
      return <DocumentListContainer {...props} id={location.options.id}>{child}</DocumentListContainer>

    default:
      return "Not Found"
  }
}
