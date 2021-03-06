import React from "react"
import styled from 'styled-components'
import {ApplyNowButton,Button} from '../uiElements'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import Icon from '../../images/icons'
import Calendar from '../../icons/icon-calendar-bg.svg'
import './programInfo.scss';


const ButtonArea = styled.div`
	
		
`
const CloseButton = styled.a`
	
`
const ItemStack = styled.div``

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
	const {items} = props.programInfo;
	const infoItem = Object.keys(items).map((item,index)=>{	
		if(index>=3)return false;
		return (
			<ItemStack key={index} className="iconStack">
				<div className="iconBox">
					<Icon name={items[item].content.icon}/>
				</div>
				<p className="programInfoItem" id={item} key={index} dangerouslySetInnerHTML={{
					__html:items[item].content.tagline
					.replace(/(<([/fp]+)>)/ig,"")
					.replace(/<\/?span[^>]*>/ig,"")
					.replace(/ (?=[^ ]*$)/i, "&nbsp;")}}/>
			</ItemStack>
		)
	})
	return(
		<>
			<h4>Program Highlights</h4>
			 <section className="program-info program-callouts" key={props.itemKey}>
			 
			 	{infoItem}
			 </section>
		</>
	)
		
}

const CareerPanel = (props)=>{
	const {headline}=props;
	
	const headlineFmt = ()=>{
		const headlineClean = (headline)?
		headline
		.replace(/<\/?br[^>]*>/ig,"")
		.replace(/(<([/fp]+)>)/ig,"")
		.replace(/<\/?span[^>]*>/ig,"")
		.replace(/ (?=[^ ]*$)/i, "&nbsp;"):null;
		
		const finalHeadline = (headlineClean)?
		 <h3 dangerouslySetInnerHTML={{__html:headlineClean}}/>:null;
		 return finalHeadline;
	 }
	
	return(
		<section className="careerSection" key={props.panelKey}>
			{headlineFmt()}
			<div className="program-info-career" dangerouslySetInnerHTML={{__html:props.content}}/>
		</section>
	)
}

////STRUCTURE AND CONTENT FOR TAB PANEL
const PanelContent = (props)=>{
	return (
		<section className="program-content-area">
			
			<section className="program-details-area">
				<Info {...props}/>
				
				<section className="program-info program-dates">
					<Dates title="Apply By" items={props.applyBy}/>
					<Dates title="Start Classes" items={props.startClasses}/>
					<ApplyNowButton location={props.location}/>
					<span className="bg-image" style={{backgroundImage:`url(${Calendar})`}}/>
				</section>
				
			</section>
			
			<section className="program-info-details" dangerouslySetInnerHTML={{__html:props.programDetails.content}}/>
			{(props.careerOpportunities)?
				<CareerPanel panelKey={props.id+'-'+props.itemKey} content={props.careerOpportunities.content} headline={props.careerOpportunities.headline}/>
				:null}
			
		</section>
	)
}

export default class ProgramInfo extends React.Component{

	handleClose = (e,target,formSelect) =>{
		e.preventDefault();
		const tabArray = target.split('__');
		this.props.onStateChange(e,
			(tabArray[1])?
			tabArray[0]:
			'',
			'',
			formSelect)
			
	}

	handleClickOutside = (e) => {
		e.preventDefault();
		this.props.onStateChange(e,null,'','');
	}
	render(){
		//add nbsp in the last space for text wrapping.
		const cleanHeadline = this.props.pageName.replace(/ (?=[^ ]*$)/i, "&nbsp;");
		//console.log(this.props,' prog info')
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
					<Button 
						label="Request Info" 
						theme="primary mobile-only" 
						jumplink='leadform' 
						onClick={(e)=>this.props.onStateChange(e,'','',this.props.programLink)}
						>
						Request Info
					</Button>
					<ApplyNowButton location={this.props.location}/>
					
				</ButtonArea>
			</>
		)
	}
}



