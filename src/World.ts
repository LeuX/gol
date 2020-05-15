export type XDymension = number;
export type YDymension = number;
export type Cell = boolean;
export type WorldRow = Cell[];
export type WorldCells = WorldRow[];
export type WorldSize = { width: XDymension, height: YDymension };

abstract class World {
    abstract toggleCell(x: XDymension, y: YDymension): World;

    abstract flatMap<A>(fn: (cell: Cell, x: XDymension, y: YDymension) => A): A[][];

    /**
     * Any live cell with fewer than two live neighbours dies, as if by underpopulation.
     * Any live cell with two or three live neighbours lives on to the next generation.
     * Any live cell with more than three live neighbours dies, as if by overpopulation.
     * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
     */
    abstract next(): World;
}

export class FiniteWorld extends World {
    private readonly cells: WorldCells;

    constructor(private worldSize: WorldSize, cells?: WorldCells) {
        super();
        this.cells = cells || Array(worldSize.width).fill(Array(worldSize.height).fill(false));
    }

    toggleCell(x: XDymension, y: YDymension): FiniteWorld {
        let nextCells = [...this.cells];
        nextCells[x] = [...nextCells[x]];
        nextCells[x][y] = !nextCells[x][y];
        return new FiniteWorld(this.worldSize, nextCells);
    }

    flatMap<A>(fn: (cell: Cell, x: XDymension, y: YDymension) => A): A[][] {
        return this.cells.map((row, x) => row.map((cell, y) => fn(cell, x, y)))
    }

    next(): FiniteWorld {
        const nextCells: WorldCells = this.flatMap((cell, x, y) => {
            const ln = this.getLiveNeighbours(x, y);
            if (cell) { // Any live cell with
                if (ln < 2) return false; // fewer than two live neighbours dies
                if (ln < 4) return true; // two or three live neighbours lives
                if (ln < 4) return false; // more than three live neighbours dies
            } else { // Any dead cell with
                if (ln === 3) return true; // exactly three live neighbours becomes a live cell
            }
            return false;
        });
        return new FiniteWorld(this.worldSize, nextCells);
    }

    getLiveNeighbours(x: XDymension, y: YDymension): number {
        return this.getNeighbours(x, y).filter(c => c).length;
    }

    private getNeighbours(x: XDymension, y: YDymension): Cell[] {
        const c = this.cells;
        return [
            c?.[x - 1]?.[y - 1],
            c?.[x + 0]?.[y - 1],
            c?.[x + 1]?.[y - 1],
            c?.[x - 1]?.[y + 0],
            // c?.[x+0]?.[y+0], // ME
            c?.[x + 1]?.[y + 0],
            c?.[x - 1]?.[y + 1],
            c?.[x + 0]?.[y + 1],
            c?.[x + 1]?.[y + 1],
        ];
    }
}