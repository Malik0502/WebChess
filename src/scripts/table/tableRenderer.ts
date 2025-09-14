import type { Turn } from "../game/manager/turnManagement/entities/turn";

export class TableRenderer{
    public renderTurns(turns: Turn[]){
        const tbody = document.querySelector<HTMLTableSectionElement>('#turn-table tbody');

        if(!tbody) return;

        tbody.innerHTML = "";

        turns.forEach((t) => {
            const row = document.createElement("tr");

            const whiteMove: string = t.whiteAlgebraicNotation ? t.whiteAlgebraicNotation : "";
            const blackMove: string = t.blackAlgebraicNotation ? t.blackAlgebraicNotation : "";

            row.innerHTML = `
            <td>${t.turn}</td>
            <td>${whiteMove}</td>
            <td>${blackMove}</td>
            `;
            tbody.appendChild(row)
        });

        const container = document.querySelector(".move-table-container") as HTMLElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}