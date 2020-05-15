import React, {useState} from 'react';
import './GameOfLive.css';
import {FiniteWorld} from "./World";
import {classNames} from "./Util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStepForward} from '@fortawesome/free-solid-svg-icons'

export const GameOfLive = () => {
    const [world, setWorld] = useState(new FiniteWorld({width: 10, height: 10}));

    return <div className="gol">
        <div className="gol-buttons">
            <FontAwesomeIcon icon={faStepForward} size="lg" className="gol-button" onClick={() => {
                setWorld(world.next())
            }}/>
        </div>
        <div className="gol-grid">
            {world.flatMap((cell, x, y) =>
                <div
                    key={`${x}${y}`}
                    onClick={() => setWorld(world.toggleCell(x, y))}
                    className={classNames({
                        "gol-item": true,
                        "alive": cell,
                        "dead": !cell,
                    })}>{world.getLiveNeighbours(x, y)}</div>)}
        </div>
    </div>;
};