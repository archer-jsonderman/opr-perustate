import React from "react"
import slugify from 'slugify'
import ProgramInfo from '../programInfo'
//import update from 'immutability-helper'
import ScrollIntoView from 'react-scroll-into-view'
import {isMobile} from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import './tab.scss';


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
	if(props.singleTabPanel && props.singleTabPanel===true)return null;
	//destructure the three items needed from props
	const {direction,parent,title} = props||'';
	
	
	//use the passed click prop
	const handleClick = (e,props)=>{
		e.preventDefault();
		props.onStateChange(e, props.tabState, props.subTabState, props.formSelect)
	}
	
	//inactive list header
	const titleLead = (title)?<li className="leader">{title}</li>:'';
	
///// -->build the list items for the tabs
	const tabItems = Object.keys(props).map((tab, index)=>{
		
/// -->if the key is not numeric, skip it
		if(isNaN(tab))return true;
		
/// --> destructure the good bits
		const{pageSlug, pageName}=props[index];
		
/// --> if there is no pageSlug, this is a container for other pages. Build a slugified name
		const parentSlug = (pageSlug)?'':slugify(pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
		
		
/// --> build state values based on passed props, which are pageSLugs
		const tabState = (parent)?[ parent, pageSlug ].join('__'): (pageSlug)?pageSlug:parentSlug;

/// --> pass subTab id to state		
		const subTabState=(props[tab].programs)?tabState+'__'+props[tab].programs[0].pageSlug:'';

/// --> Pass program code to the form drop down select via state		
		const formSelect =  (subTabState)?props[tab].programs[0].programCode:props[tab].programCode;
		
		const activeClass = (tabState===props.active)?'selected':'';
		const Chevron = (parent)?<span><FontAwesomeIcon icon={faChevronRight} className="tab-arrow-icon"/></span>:'';
				//return tab
		return (
			<li 
				className={[tab, activeClass].join(' ')}
				key={index} 
				>
				<a 
					href={"#"+tabState} 
					onClick={(e)=>
							handleClick(e,
								{
									onStateChange:props.onStateChange,
									tabState:tabState,
									subTabState:subTabState,
									formSelect:formSelect
								}
							)
							}> 
					{pageName} 
				</a>
				{Chevron}
			</li>
		)
	})
	////end Object mapping
	
	return (
		<ul 
			id={props.id} 
			className={
				["tabPanel ", direction, props.viewport].join(' ')
			}
			>
			{titleLead}
			{tabItems}
		</ul>
		)
	
}

////CONTENT PANEL -> make external functional component

const ContentPanel = (props) =>{
	/**  TODO::: pull in programCode from content and replace programMapping.  **/
	const {pageSlug, id} = props;
	const ref = React.createRef();	
	const handleClick = (e,slug) =>{
		window.scrollTo(0, (ref.current.offsetTop - (90 + ref.current.parentNode.offsetHeight)))
		e.preventDefault()
		///need to detect tab or subtab
		if(props.active===slug){
			props.onStateChange(e,'')
		}else{
			props.onStateChange(e,slug)
			window.scrollTo(0, (ref.current.offsetTop - 90))
			}
        }
        
	const slug = (pageSlug)?pageSlug:slugify(id,{remove: /[*+~.()'"!:@]/g,lower:true});
	const activeClass = (slug === props.active)?'selected':'';
//const slugPanel = props.pageSlug+'_panel'//slug+'_panel' 


	
	return(
		<div 
			className={"contentPanel "+activeClass} 
			id={slug}
		>
			<ScrollIntoView 
				selector={"#"+slug} 
				className="accordion-trigger mobile-only" 
				alignToTop={true} 
				onClick={(e)=>handleClick(e,slug,ref)}
			>
				<h4 
					className='tab mobile-only' 
					ref={ref} 
					data-target={slug+'_panel'} 
				>
					{props.pageName}				
				</h4> 

			</ScrollIntoView>
			 <div className="contentTarget " id={slug+'_panel'}>
			 	
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
				location={props.location}
				{...props[index]} 
				id={props[index].pageName}
				pageSlug={props[index].pageSlug}
				key={index}
				itemKey={index} 
				onStateChange={props.onStateChange}
				onParentStateChange={props.onParentStateChange}
				singleTabPanel={props.singleTabPanel}
				/>
		):(
			<ContentPanel 
				{...props[index]} 
				id={props[index].pageSlug}
				pageSlug={props[index].pageSlug}
				active={props.active.activeTab} 
				key={index}
				itemKey={index}
				location={props.location}
				onStateChange={props.onStateChange}
				onParentStateChange={props.onStateChange}
				singleTabPanel={props.singleTabPanel}/>
		)
		return programPanel
	});
			
	return panels
}
///Make external class
export class NestedPanel extends React.Component{
	constructor(props){
		super(props)
		this.slug = this.props.pageSlug ||slugify(this.props.pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
		
	}
	
	
	render(){
		const ref = React.createRef();
		///create stack of content sub panels
		const subpanels =  Object.keys(this.props.programs).map((program, index)=>{
			
			if(isNaN(program))return true;
			const subSlug = [this.slug,this.props.programs[index].pageSlug].join('__');
			//console.log(subSlug, 'subpage slug')
			return(
				<ContentPanel 
					{...this.props.programs[index]}
					location={this.props.location} 
					id={subSlug}
					pageSlug={subSlug}
					active={this.props.active.activeSubTab} 
					key={index}
					itemKey={index}
					onStateChange={this.props.onStateChange}
					onParentStateChange={this.props.onParentStateChange}
					singleTabPanel={this.props.singleTabPanel}/>
				
			)})
			
			
		
		const activeParent = (this.props.active.activeTab===this.slug)?'selected':'';
		const slugPanel = this.slug+'_panel';
		const handleClick = (e,slug,ref) =>{
			window.scrollTo(0, (ref.current.offsetTop - (90 + ref.current.parentNode.offsetHeight)))			
			e.preventDefault()
			if(this.props.active.activeTab===slug){
				this.props.onStateChange(e,'')
			}else{
				this.props.onStateChange(e,this.slug)
				
			}
		}
		const accordionTrigger = (this.props.singleTabPanel===true)?'single-tab expanded':'accordion-trigger';
		///make the item call ContentPanel. 
		return(
				<div 
					className={"contentPanel nested "+activeParent}
					id={this.slug}
				>
					<ScrollIntoView selector={"#"+this.slug} className={[accordionTrigger,  'mobile-only'].join(' ')} alignToTop={true} onClick={(e)=>handleClick(e,this.slug,ref)}>
						<h4 className='tab mobile-only' ref={ref} data-target={slugPanel} >
							{this.props.pageName}
							
						</h4>
						<FontAwesomeIcon icon={faChevronDown} className="tab-arrow-down"/>
					</ScrollIntoView>
					<div className="nestedContentPanel">
						<TabsPanel 
							direction="vertical" 
							{...this.props.programs} 
							active={this.props.active.activeSubTab} 
							onTabClick={this.props.onParentStateChange} 
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
		//console.log(props,' build')
		if(props[0]){
			const initTab = (isMobile)?'':(props[0].pageSlug)?props[0].pageSlug:slugify(props[0].pageName,{remove: /[*+~.()'"!:@]/g,lower:true});
			//check for subtabs, then activate the first on if this is desktop
			const subTabCheck = (props[0].programs)?'__'+props[0].programs[0].pageSlug:'';
			const initSubTab = (isMobile)?'':initTab+subTabCheck;
			const formSelect = ''//(subTabCheck)?props[0].programs[0].programCode:props[0].programCode;
			this.props.onStateChange('',initTab,initSubTab,formSelect)
			
		}	else{
			this.props.onStateChange('','','','')
		}
		
	}
	 
   
	render(){
		const singleTabPanel=(this.props[1])?false:true; 
		return(
			<section id="tabbedArea" className="tabbedArea">
				<div className="desktop-shim">
					<TabsPanel {...this.props} 
						active={this.props.state.activeTab}
						onStateChange = {this.props.onStateChange}
						onTabClick={this.props.onParentStateChange}
						id="tabPanelTop"
						viewport="desktop-only"
						singleTabPanel={singleTabPanel}
					/>
					
					<ContentPanelContainer 
						active={this.props.state}
						onStateChange = {this.props.onStateChange}
						singleTabPanel={singleTabPanel}
						{...this.props}/>
				</div>
			</section>				
			
		)
	}
	
}