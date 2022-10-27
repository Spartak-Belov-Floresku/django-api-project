import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Recipe from '../components/Recipe'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listRecipes } from '../actions/recipeActions'

export default function HomeScreen() {
  const dispatch = useDispatch()

  const { error, loading, recipes } = useSelector( state => state.recipeList )

  useEffect(() => {
    dispatch(listRecipes())
  }, [dispatch])

  return (
    <div>
      <h4>Latest Recipes</h4>
      { loading ? <Loader/>
          : error ? <Message variant='danger'>{error}</Message>
                  : <Row>
                      { recipes.map(recipe => (
                          <Col key={recipe.id} sm={12} md={6} lg={4} xl={3}>
                              <Recipe recipe={recipe}/>
                          </Col>
                      ))}
                  </Row>
      }
    </div>
  )
}