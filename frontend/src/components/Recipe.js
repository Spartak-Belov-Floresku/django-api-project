import { Card  } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function Recipe({recipe}){
    return (
      <Card className="my-3 p-3 rounded boxshadow opacity">
        <Link to={`/recipes/${recipe.id}`}>
            <Card.Img src={recipe.image}></Card.Img>
        </Link>

        <Card.Body>
            <Link to={`/recipes/${recipe.id}`}>
                <Card.Title as='span'>
                    <strong>{recipe.title.length <= 26
                                ? recipe.title
                                : recipe.title.substring(0,26) + '...' }</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <div className="my-3">

                </div>
            </Card.Text>

        </Card.Body>
      </Card>
    )
}