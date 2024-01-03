
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }
    componentWillUnmount() {
        // this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }
        this.setState(({offset, chars}) => ({
                chars: [...chars, ...newChars], 
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading:  true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setItemRef = (elem) => {
        this.itemRefs.push(elem);
    }

    itemFocus = (id) => {
            this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
            this.itemRefs[id].classList.add('char__item_selected');
            this.itemRefs[id].focus();
    }


    renderItems(arr) {
        const items = arr.map((items, i)=> {
            let imgStyle = {'objectFit' : 'cover'};
            if (items.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                <li className="char__item"
                    key={items.id}
                    ref={this.setItemRef}
                    onClick={() => {                       
                        this.props.onCharSelected(items.id);
                        this.itemFocus(i);}}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                // this.props.onCharSelected(item.id);
                                this.itemFocus(i);
                            }
                        }}>
                    <img src={items.thumbnail} alt={items.name} style={imgStyle}/>
                    <div className="char__name">{items.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    render() {
        const {chars, error, loading, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(chars);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style = {{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;