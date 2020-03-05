import React from "react"
import styled from 'styled-components'
import {Button} from '../uiElements'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import './programInfo.scss';

const ButtonArea = styled.div`
	display:grid;
	grid-template-columns:1fr 1fr;
	grid-auto-flow:column;
	grid-auto-columns:1fr;
	grid-column-gap:.5rem;
	justify-content:center;
	background: -moz-linear-gradient(top,  rgba(255,255,255,0) 0%, rgba(255,255,255,1) 38%, rgba(255,255,255,1) 100%);
	background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 38%,rgba(255,255,255,1) 100%);
	background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 38%,rgba(255,255,255,1) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 );
	padding-top:2rem;
	@media (min-width:768px){
		grid-template-columns:max-content;
		grid-auto-columns:max-content;
		background: transparent;
	}
		
`
const CloseButton = styled.a`
	margin-bottom:.3rem;
	font-size:25px;
	color:${props=>props.theme.darkgray};
    float: right;
    margin-top: -17px;
    margin-right: -10px;
}
`


////STRUCTURE FOR THE APPPLY AND START DATE LISTS
const Dates = (props) =>{
	//CREATE LIST OF DATES FROM PROVIDED CSV STRING
	const list = props.items.split(',').map((item,index)=>(<li key={index}>{item}</li>))
	//CREATE ID FRIENDLY STRING FROM TITLE
	const elemId = props.title.split(' ').join('').toLowerCase();
	return (
		<div className="programInfoItem programInfoDate" id={elemId.charAt(0)+elemId.slice(1)}>
			<p>{props.title}</p>
			<ul>{list}</ul>
		</div>
	)
}

////STRUCTURE AND CONTENT FOR INFO AREA OF EACH PROGRAM PANEL
const Info = (props) =>{
	const infoArray = ['transferrableCredits','tuition','creditHours','totalCost'];
	const infoItem = Object.keys(props).map((item,index)=>{
		if(infoArray.indexOf(item)>-1){
			const nameSpaced = item.split(/(?=[A-Z])/).join(' ');
			const name = nameSpaced.charAt(0).toUpperCase()+nameSpaced.slice(1);
			if(props[item]!= null){
				return (<p className="programInfoItem" id={item} key={index}><strong>{name}</strong> {props[item]}</p>)
			}
			return false
			}
		return true
	})
	return(
		 <div className="program-info program-info-area">
		 	{infoItem}
		 </div>
	 )
}

const CareerPanel = (props)=>{
	return (
		[<h4>Career Opportunities</h4>,
		<div className="program-info-career" dangerouslySetInnerHTML={{__html:props.content}}/>
		]
	)
}

////STRUCTURE AND CONTENT FOR TAB PANEL
const PanelContent = (props)=>{
	//console.log(props, ' panel content')
	return (
		<div className="program-content-area">
			
			<div className="program-details-area">
				<Info {...props}/>
				<div className="program-info program-info-dates">
					<Dates title="Apply By" items={props.applyBy}/>
					<Dates title="Start Classes" items={props.startClasses}/>
				</div>
			</div>
			<div className="program-info-details" dangerouslySetInnerHTML={{__html:props.programDetails.content}}/>
			{(props.careerOpportunities)?
				<CareerPanel content={props.careerOpportunities.content}/>
				:null}
			
		</div>
	)
}

export default class ProgramInfo extends React.Component{

	handleClose = (e,target,formSelect) =>{
		//console.log(formSelect,' onClose')
		e.preventDefault();
		const tabArray = target.split('__');
		if(tabArray.length<2){
			this.props.onStateChange(e,'','',formSelect);
		}else{
			this.props.onStateChange(e,tabArray[0],'',formSelect);
		}
	}
	handleParentChange = (e,props)=>{
		//console.log(props,' parent change')
		this.props.onParentStateChange(props);
		this.props.onStateChange(e,null,'',props);
	}
	handleClickOutside = (e) => {
		e.preventDefault();
		this.props.onStateChange(e,null,'','');
	}
	render(){
		//add nbsp in the last space for text wrapping.
		//console.log(this.props, 'info')
		const cleanHeadline = this.props.pageName.replace(/ (?=[^ ]*$)/i, "&nbsp;");

		return(		
			<>
				<CloseButton
						href="#"
						className="menu-close mobile-only"
						onClick={(e)=>this.handleClose(e,this.props.id,'')}
						aria-label="Close program details">
						<span className="sr-only">Close</span>
						<FontAwesomeIcon icon={faTimesCircle}/>
					</CloseButton>
				<h3 dangerouslySetInnerHTML={{__html:cleanHeadline}}/>	
				<PanelContent {...this.props}/>
				<ButtonArea className="program-info-buttons">
					<Button label="Request Info" theme="primary mobile-only" jumplink='leadform' onClick={(e)=>this.handleParentChange(e,this.props.programLink)}>
						Request Info
					</Button>
					<Button label="Apply Now" theme="secondary" outlink="https://online.peru.edu/apply-now">
						Apply Now
					</Button>
					
				</ButtonArea>
			</>
		)
	}
}



