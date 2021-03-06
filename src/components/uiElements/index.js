import React from "react"
import styled from "styled-components"
import ScrollIntoView from 'react-scroll-into-view'
import './ui.scss';

const ButtonLink = styled.a`
`

export class Button extends React.Component{
	
	render(){
		const buttonId = this.props.label.split(' ').join('-').toLowerCase();
		const btnTarget = this.props.target||"_self";
		const button = (this.props.jumplink)?
			<ScrollIntoView selector={'#'+this.props.jumplink} className={this.props.className} onClick={this.props.onClick}>
				<ButtonLink id={buttonId} aria-label={this.props.label} className={"button "+[this.props.theme,this.props.className].join(' ')}>
					{this.props.label}
				</ButtonLink>
			</ScrollIntoView>
		:
				<ButtonLink 
					id={buttonId} 
					aria-label={this.props.label} 
					className={"button "+[this.props.theme,this.props.className].join(' ')} 
					href={this.props.outlink||"#"} 
					target={btnTarget}>
					{this.props.label}
				</ButtonLink>

		return button;
	}
	
}
Button.defaultProps={
    theme: "primary",
    label: "Click Here",
    jumplink: false,
    outlink: false,
    
}
///Not sure we are even using this
const TabItem = (props)=>{
	return(
		<div className={['tab', props.tabClass].join(' ')} >
			<button 
				onClick={props.onClick} 
				data-target={props.id}> 
				{props.title} 
			</button>
		</div>
	)	
}

export class Tab extends React.Component{	
	render(){
		return(
			<TabItem {...this.props}/>
			
		)
	}
}

export class ApplyNowButton extends Button{
	render(){
		const searchVars = ["https://online.peru.edu/apply-now",(this.props.location)?this.props.location.search:''].join('');
		return(
		<Button label="Apply Now" theme="secondary" className={["apply-now",this.props.className].join(' ')} outlink={searchVars}/>
		)
		}
}


