import React, { Component } from 'react';
import logo from './logo.svg';
import classes from './App.module.css';
import Person from './Persons/Person/Person';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

class App extends Component {
    state = {
        persons: [
            {
                id: 'qwert',
                name: 'Max',
                age: 28
            },
            {
                id: 'asdfg',
                name: 'Bob',
                age: 20
            },
            {
                id: 'zxcvb',
                name: 'Stephanie',
                age: 26
            }
        ],
        showPersons: false
    };

    deletePersonsHandler = (personIndex) => {
        const persons = [...this.state.persons]; // ! ... Makes a copy of the array
        persons.splice(personIndex, 1);
        this.setState({ persons: persons });
    };

    nameChangedHandler = (event, id) => {
        const personIndex = this.state.persons.findIndex((pers) => {
            return pers.id === id;
        });

        const person = {
            ...this.state.persons[personIndex]
        };

        person.name = event.target.value;

        const persons = [...this.state.persons];
        persons[personIndex] = person;

        this.setState({ persons: persons });
    };

    togglePersonsHandler = () => {
        const doesShow = this.state.showPersons;
        this.setState({ showPersons: !doesShow });
    };

    render() {
        let persons = null;
        let btnClass = '';

        if (this.state.showPersons) {
            persons = (
                <div>
                    {this.state.persons.map((person, index) => {
                        return (
                            <ErrorBoundary key={person.id}>
                                <Person
                                    click={() =>
                                        this.deletePersonsHandler(index)
                                    }
                                    name={person.name}
                                    age={person.age}
                                    changed={(event) =>
                                        this.nameChangedHandler(
                                            event,
                                            person.id
                                        )
                                    }
                                />
                            </ErrorBoundary>
                        );
                    })}
                </div>
            );

            btnClass = classes.Red;
        }

        const assignedClasses = [];
        if (this.state.persons.length <= 2) {
            assignedClasses.push(classes.red); // classes = ['red']
        }
        if (this.state.persons.length <= 1) {
            assignedClasses.push(classes.bold);
        }

        return (
            <div className={classes.App}>
                <h1>This is Bob!</h1>
                <p className={assignedClasses.join(' ')}>This works</p>
                <button
                    className={btnClass}
                    onClick={this.togglePersonsHandler}
                >
                    Switch Name
                </button>
                {persons}
            </div>
        );
        // ! ^^^ This compiles into the below code automatically
        // return React.createElement('div', null, 'h1', 'This is Bob!!!!'); // ? This will create text in the div element, not an h1 child

        // return React.createElement(
        //     'div',
        //     { className: 'App' }, // ? instead of null, pass in a js object
        //     React.createElement('h1', null, 'This is Bob!!!!')
        // ); // ? Have to nest another React.createElement to create a child element
    }
}

export default App;

console.log(classes);
