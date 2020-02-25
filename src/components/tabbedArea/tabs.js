import React from "react"
import styled from 'styled-components'
import slugify from 'slugify'
import ProgramInfo from '../programInfo'
import update from 'immutability-helper'
import ScrollIntoView from 'react-scroll-into-view'
import {isMobile} from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {Button as MuiButton, 
	DialogActions,
	Dialog} from '@material-ui/core';
import './tab.scss';


const StyledDialog = styled(Dialog)`
	top:90px!important;
	.MuiDialog-scrollPaper{
		.MuiDialog-paper{
			&.MuiDialog-paperWidthSm{
				max-width:none!important;
			}
			&.MuiDialog-paperScrollPaper{
				width:100%;
			}
			margin:0;
		}
	}
	.MuiDialog-paperScrollPaper{
			max-height:100%;
		}

`
/**replace this with a GraphQL query**/
const programMapping = 
	{'Business Administration in Accounting':'BSBA - ACCT',
	'Business Administration in Computer Management Information Systems (CMIS)':'BSBA - CMIS',
	'Business Administration in Human Resources and Risk Management':'BSBA - HR',
	'Business Administration in Management':'BSBA - MGMT',
	'Business Administration in Management Applied Science (BAS)':'BAS - MGMT',
	'Business Administration in Marketing':'BSBA - MKTG',
	'Business Administration in Public Administration':'BSBA - PA',
	'Criminal Justice in Counseling':'CJUS - CS',
	'Criminal Justice in Adminstration':'CJUS - JA',
	'Criminal Justice in Law & Society':'CJUS - LAW',
	'Master of Science in Education':'MS - ED',
	'Master of Science in Organizational Management':'MS - OM',
	'Psychology':'BS/BA - PSYCH',
	'Undecided':'Undergrad - Undecided'}

////BUILD TABBED LAYOUT
////EACH TAB WILL NEED TO EXPOSE THE CORRESPONDING CONTENTPANEL ON CLICK, AS WELL AS HIDE ANY EXPOSED PANELS
////HANDLE EXPOSE/HIDE VIA CSS SO THAT ALL PANELS ARE ON THE PAGE AT RENDER, JUST HIDDEN. THIS WILL ALLOW DEEP LINKING FOR NESTED TAB ARRAYS

////COMPONENT MODULES

////TABS PANEL -> Make external functional component
const TabsPanel = (props)=>{
	const {direction,parent,title} = props||'';
	const handleClick = (e,props)=>{
		e.preventDefault();
		props.click(e,props.tabState, props.subTabState)
	}
	const titleLead = (title)?<li className="leader">{title}</li>:'';
	const tabItems = Object.keys(props).map((tab, index)=>{
		if(isNaN(tab))return true;
		
		const{pageName}=props[index];
		
		const tabState = (parent)?slugify([parent,pageName].join('__'),{remove: /[*+~.()'"!:@]/g,lower:true}):slugify(pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
		const subTabState=(props[tab].programs)?tabState+'__'+slugify(props[tab].programs[0].pageName,{remove: /[*+~.()'"!:@]/g,lower:true}):'';
		const activeClass = (tabState===props.active)?'selected':'';
		const Chevron = (parent)?<span><FontAwesomeIcon icon={faChevronRight} className="tab-arrow-icon"/></span>:'';
		
		//Mobile needs to trigger Dialog. 
		
		
		//return tab
		return (
			<li 
				className={[tab, activeClass].join(' ')}
				key={index} 
				>
				<a href={"#"+tabState} onClick={(e)=>handleClick(e,{click:props.onStateChange,tabState:tabState,subTabState:subTabState})}> 
					{pageName} 
				</a>
				{Chevron}
			</li>
		)
	})
	return (
		<ul id={props.id} className={["tabPanel ",direction,props.viewport].join(' ')}>
			{titleLead}
			{tabItems}
		</ul>
		)
	
}

////CONTENT PANEL -> make external functional component

const ContentPanel = (props) =>{
	
	const ref = React.createRef();	
	const handleClick = (e,slug) =>{
		e.preventDefault()
		///need to detect tab or subtab
		if(props.active===slug){
				props.onStateChange(e,'')
			}else{
				props.onStateChange(e,slug)
				
			}
        }
	const slug = slugify(props.id,{remove: /[*+~.()'"!:@]/g,lower:true});
	const activeClass = (slug === props.active)?'selected':'';
	const slugPanel = slug+'_panel';
	
	
	return(
		<div 
			className={"contentPanel "+activeClass} 
			id={slug}
		>
			<ScrollIntoView selector={"#"+slug} className="accordion-trigger mobile-only">
				<h4 className='tab mobile-only' ref={ref} data-target={slugPanel} onClick={(e)=>handleClick(e,slug)}>
					{props.pageName}					
				</h4> 

			</ScrollIntoView>
			 <div className="contentTarget" id={slugPanel}>
			 	
		 		<ProgramInfo {...props} programLink={programMapping[props.pageName]}/>		 		
		 	</div>
		</div>
	)
}



////CONTAINER TO HOLD ALL THE CONTENT PANELS
const ContentPanelContainer = (props) =>{
	const panels = Object.keys(props).map((child, index)=>{
		if(isNaN(child))return true;
		///if programs exist, this is a nested tab panel
		const programPanel = (props[index].programs)?(
			<NestedPanel 
				active={props.active}
				{...props[index]} 
				id={props[index].pageName}
				key={index} 
				onStateChange={props.onStateChange}
				onParentStateChange={props.onParentStateChange}
				/>
		):(
			<ContentPanel 
				{...props[index]} 
				id={props[index].pageName}
				active={props.active.activeTab} 
				key={index}
				onStateChange={props.onStateChange}/>
		)
		return programPanel
	});
			
	return panels
}
///Make external class
export class NestedPanel extends React.Component{
	constructor(props){
		super(props)

		this.slug = slugify(this.props.pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
		
	}
	
	
	render(){
		
		//const ref = React.createRef();
		///create stack of content sub panels
		const subpanels =  Object.keys(this.props.programs).map((program, index)=>{
			if(isNaN(program))return true;
			const subSlug = slugify([this.props.pageName,this.props.programs[index].pageName].join('__'),{remove: /[*+~.()'"!:@]/g,lower:true});
			//const activeClass = (subSlug === this.props.active.activeSubTab)?'selected':'';

			return(
				<ContentPanel 
					{...this.props.programs[index]} 
					id={subSlug}
					active={this.props.active.activeSubTab} 
					key={index}
					onStateChange={this.props.onStateChange}
					onParentStateChange={this.props.onParentStateChange}/>
				
			)})
			
			
		
		const activeParent = (this.props.active.activeTab===this.slug)?'selected':'';
		const slugPanel = this.slug+'_panel';
		const handleClick = (e,slug) =>{
			e.preventDefault()
			if(this.props.active.activeTab===slug){
				this.props.onStateChange(e,'')
			}else{
				this.props.onStateChange(e,this.slug)
			}
		}
		///make the item call ContentPanel. 
		return(
				<div 
					className={"contentPanel nested "+activeParent}
					id={this.slug}
				>
					<ScrollIntoView selector={"#"+this.slug} className="accordion-trigger mobile-only">
						<h4 className='tab mobile-only' data-target={slugPanel} onClick={(e)=>handleClick(e,this.slug)}>
							{this.props.pageName}
							
						</h4>
						<FontAwesomeIcon icon={faChevronDown} className="tab-arrow-down"/>
					</ScrollIntoView>
					<div className="nestedContentPanel">
						<TabsPanel 
							direction="vertical" 
							{...this.props.programs} 
							active={this.props.active.activeSubTab} 
							onTabClick={this.props.onTabClick} 
							onStateChange={this.props.onStateChange}
							parent={this.slug}
							viewport='nested'
							title={this.props.pageName} 
						/>
	
						{subpanels}
					</div>
				</div>
		)
	}
}


export default class TabbedArea extends React.Component{
	constructor(props){
		super(props)
		//console.log(props[0],' build')
		if(props[0]){
			const initTab = (isMobile)?'':slugify(props[0].pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
			//check for subtabs, then activate the first on if this is desktop
			const subTabCheck = (props[0].programs)?slugify(props[0].programs[0].pageName,{remove: /[*+~.()'"!:@]/g,lower:true}):'';
			const initSubTab = (isMobile)?'':initTab+'__'+subTabCheck;

			this.props.onStateChange('',initTab,initSubTab,'')
		}	else{
			this.props.onStateChange('','','','')
		}
	}
	
	handleStateChange =(e,tabState,subTabState,formSelect)=>{
		if(tabState===null)tabState=this.state.activeTab;
		const tabArray = tabState.split('__');
		console.log(tabArray,' array')
		
		if(isMobile){
			
		}
		var subTab = '';
		var tab = '';
		var tabPanel = '';
		var subTabPanel = '';
		
		if(tabArray.length < 2){
			subTab = '';
			tab = tabState;
			tabPanel = tab+'_panel';
			subTabPanel = '';
		}else{
			subTab = tabState;
			tab = tabArray[0];
			tabPanel = tab+'_panel';
			subTabPanel = subTab+'_panel';
		}
		if(subTabState)subTab=subTabState;
		
		e.preventDefault();
		const updatedState = update(
		   this.state,{
			   'activeTab':{$set:tab},
			   'activePanel':{$set:tabPanel},
   			   'activeSubTab':{$set:subTab},
			   'activeSubPanel':{$set:subTabPanel},
			   'formSelect':{$set:formSelect}
		   }
		)	  
	   this.setState(updatedState)
	   
   }
  
   
	render(){
		return(
			<section id="tabbedArea" className="tabbedArea">
				<div className="desktop-shim">
					<TabsPanel {...this.props} 
						active={this.props.state.activeTab}
						onStateChange = {this.props.onStateChange}
						onTabClick={this.handleTabClick}
						id="tabPanelTop"
						viewport="desktop-only"
					/>
					
					<ContentPanelContainer 
						active={this.props.state}
						onStateChange = {this.props.onStateChange}
						{...this.props}/>
				</div>
			</section>				
			
		)
	}
	
}