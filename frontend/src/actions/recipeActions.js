import axios from 'axios'
import {
    RECIPE_LIST_REQUEST,
    RECIPE_LIST_SUCCESS,
    RECIPE_LIST_FAIL,

} from '../constants/recipeContstants'

export const listRecipes = () => async (dispatch) => {
    try{
        dispatch({
            type: RECIPE_LIST_REQUEST,
        })
        const {data} = await axios.get('/api/recipe/recipes/list/')

        dispatch({
            type: RECIPE_LIST_SUCCESS,
            payload: data,
        })

    }catch(error){
        dispatch({
            type: RECIPE_LIST_FAIL,
            payload: error.response && error.response.data.detail
                        ? error.response.data.detail
                        : error.message,
        })
    }
}
