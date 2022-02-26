import { Model, attr } from 'redux-orm';
 
class User extends Model {
    toString() {
        return `User: ${this.name}`;
    }
    // Declare any static or instance methods you need.
}
User.modelName = 'User';
 
// Declare your related fields.
User.fields = {
    id: attr(), // non-relational field for any value; optional but highly recommended
    name: attr()
};
 
export default User;