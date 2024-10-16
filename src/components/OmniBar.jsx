import React from "react"
import PropTypes from "prop-types"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import InputBase from "@material-ui/core/InputBase"
import Divider from "@material-ui/core/Divider"
import Tooltip from "components/Tooltip"
import Fade from "@material-ui/core/Fade"
import Typography from "@material-ui/core/Typography"
import ClearIcon from "@material-ui/icons/Clear"
import FilterOnIcon from "@material-ui/icons/FilterAlt"
import FilterOffIcon from "@material-ui/icons/FilterAltOutlined"
import FilterGlobalIcon from "icons/FilterGlobal"
import WordSearchIcon from "@material-ui/icons/FormatQuote"
import RegExpIcon from "icons/RegExp"
import MainMenu from "components/MainMenu"
import CaseInsensitiveIcon from "@material-ui/icons/FormatStrikethrough"
import CaseSensitiveIcon from "@material-ui/icons/Title"
import Logo from "icons/Logo"
import { withStyles } from "@material-ui/core/styles"
import { withCookies } from "contexts/CookiesContext"
import { withStorage } from "contexts/StorageContext"
import { withSearch } from "contexts/SearchContext"
import { withFocus } from "contexts/FocusContext"
import { withI18n } from "contexts/I18nContext"

const styles = theme => ({
	root: {
		padding: theme.spacing ( 0.25, 0.5 ),
		display: "flex",
		alignItems: "center",
		position: "absolute",
		width: "100%",
		zIndex: 10,
		top: 0,
		left: 0,
		userSelect: "none",
		borderTop: `solid 1px transparent`,
		borderBottom: `solid 1px transparent`,
		transition: "all 200ms",
		borderRadius: 0,
	},
	unFocused: {
		borderBottom: `solid 1px ${theme.palette.divider}`,
	},
	input: {
		flex: 1,
		marginLeft: theme.spacing ( 0.5 ),
	},
	button: {
		padding: 6,
	},
	logo: {
		color: theme.palette.primary.main,
		fontSize: 34,
	},
	divider: {
		height: 28,
		margin: 4,
	},
	hits: {
		margin: theme.spacing ( 0, 1 ),
		whiteSpace: "pre",
		fontWeight: 700,
	},
})

class OmniBar extends React.Component {

	constructor ( props ) {
		super ( props )
		this.state = {
			focused: true,
		}
	}
	componentDidMount() {
		// Set filtered to false when the component mounts
		this.props.search.set("filtered", false);
		console.log('omg omg omg')
	  }
	handleSnackbar = (message) => {
		// Implement your snackbar logic here
		console.log(message); // Temporary fallback
	  }
	render () {
		const { classes, storage, focus, search, cookies, theme, i18n } = this.props
		const { focused } = this.state
		const { term, filtered } = search
		const { data: { sensitive, regexp } } = storage
		const hits = cookies.found.length

		return <Paper
			className={`${classes.root} ${!focused ? classes.unFocused : ""}`}
			elevation={focused ? 5 : 0}
			onFocus={() => this.setState ({ focused: true })}
			onBlur={() => this.setState ({ focused: false })} >
			<IconButton
				className={classes.button}
				disabled={true}
				size="small"
				color="primary" >
				<Logo viewBox="0 0 48 48" fontSize="inherit" className={classes.logo} />
			</IconButton>
			<InputBase
				autoFocus
				className={classes.input}
				placeholder={regexp ? i18n.translate ("searchWithRegExpPlaceholder") : i18n.translate ("searchPlaceholder")}
				value={term}
				onChange={e => search.set ( "term", e.target.value )}
				inputProps={{ spellCheck: false, id: "search" }}
				style={
					regexp && term.length > 0 && !search.compile ( term, sensitive )
					? { color: theme.palette.error.main }
					: {}
				}
			/>
			{
				term.length > 0 && <React.Fragment>
					<Tooltip
						arrow
						TransitionComponent={Fade}
						placement="bottom"
						title="Clear Search Term" >
						<IconButton
							size="small"
							color="primary"
							className={classes.button}
							onClick={() => search.set ( "term", "" )} >
							<ClearIcon/>
						</IconButton>
					</Tooltip>
					<Divider
						className={classes.divider}
						orientation="vertical"
					/>
				</React.Fragment>
			}
			<Typography
				id="hits"
				variant="overline"
				className={classes.hits} >
				{`${hits.toString ().replace ( /\B(?=(\d{3})+(?!\d))/g, "," )} ${hits > 1 || hits < 1 ? i18n.translate ("cookies") : i18n.translate ("cookie")}`}
			</Typography>
			<Divider
				className={classes.divider}
				orientation="vertical"
			/>
			<Tooltip
				arrow
				TransitionComponent={Fade}
				placement="bottom"
				title={sensitive ? i18n.translate ("caseSensitiveTooltip") : i18n.translate ("caseInsensitiveTooltip")} >
				<IconButton
					size="small"
					color="primary"
					className={classes.button}
					onClick={() => storage.set ( "sensitive", !sensitive )} >
					{sensitive ? <CaseSensitiveIcon/> : <CaseInsensitiveIcon/>}
				</IconButton>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation="vertical"
			/>
			<Tooltip
				arrow
				TransitionComponent={Fade}
				placement="bottom"
				title={regexp ? i18n.translate ("searchRegExpTooltip") : i18n.translate ("searchSubstringTooltip")} >
				<IconButton
					size="small"
					color="primary"
					className={classes.button}
					onClick={() => storage.set ( "regexp", !regexp )} >
					{regexp ? <RegExpIcon/> : <WordSearchIcon/>}
				</IconButton>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation="vertical"
			/>
			<Tooltip
				arrow
				TransitionComponent={Fade}
				placement="bottom"
				title={!focus.last ? i18n.translate ("filterUnavailableTooltip") : filtered ? i18n.translate ("filterFocusedTooltip") : i18n.translate ("filterAllTooltip") } >
				<IconButton
					size="small"
					color="primary"
					className={classes.button}
					disabled={!focus.last}
					onClick={() => search.set ( "filtered", !filtered )} >
					{!focus.last ? <FilterGlobalIcon/> : filtered ? <FilterOnIcon/> : <FilterOffIcon/>}
				</IconButton>
			</Tooltip>
			<Divider
				className={classes.divider}
				orientation="vertical"
			/>
			<MainMenu onSnackbar={this.handleSnackbar}/>
		</Paper>
	}

}

OmniBar.propTypes = {
	classes: PropTypes.object.isRequired,
	storage: PropTypes.object.isRequired,
	focus: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	cookies: PropTypes.object.isRequired,
}

export default
withStorage (
	withFocus (
		withSearch (
			withCookies (
				withI18n (
					withStyles ( styles, { withTheme: true } ) ( OmniBar )
				)
			)
		)
	)
)
