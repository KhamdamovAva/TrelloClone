import React, { useContext, useState } from "react";
import { Edit2, Trash } from "react-feather";
import CardAdd from "./CardAdd";
import { BoardContext } from "../context/BoardContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddList from "./AddList";
import Utils from "../utils/Utils";

const Main = () => {
  const { allboard, setAllBoard } = useContext(BoardContext);
  const activeBoard = allboard.boards[allboard.active];

  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardTitle, setEditingCardTitle] = useState("");

  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState("");

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === "list") {
      const reorderedLists = Array.from(activeBoard.list);
      const [movedList] = reorderedLists.splice(result.source.index, 1);
      reorderedLists.splice(result.destination.index, 0, movedList);

      const updatedBoard = { ...allboard };
      updatedBoard.boards[updatedBoard.active].list = reorderedLists;
      setAllBoard(updatedBoard);
    } else {
      const updatedLists = [...activeBoard.list];
      const srcListId = parseInt(result.source.droppableId);
      const destListId = parseInt(result.destination.droppableId);
      const [movedCard] = updatedLists[srcListId - 1].items.splice(result.source.index, 1);
      updatedLists[destListId - 1].items.splice(result.destination.index, 0, movedCard);

      const updatedBoard = { ...allboard };
      updatedBoard.boards[updatedBoard.active].list = updatedLists;
      setAllBoard(updatedBoard);
    }
  };

  const addCard = (text, listIndex) => {
    const updatedLists = [...activeBoard.list];
    updatedLists[listIndex].items.push({ id: Utils.makeid(5), title: text });

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
  };

  const addList = (title) => {
    const updatedLists = [...activeBoard.list];
    updatedLists.push({
      id: Utils.makeid(5),
      title: title,
      items: [],
    });

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
  };

  const deleteList = (listIndex) => {
    const updatedLists = [...activeBoard.list];
    updatedLists.splice(listIndex, 1);

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
  };

  const deleteCard = (listIndex, cardIndex) => {
    const updatedLists = [...activeBoard.list];
    updatedLists[listIndex].items.splice(cardIndex, 1);

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
  };

  const startEditingCard = (card) => {
    setEditingCardId(card.id);
    setEditingCardTitle(card.title);
  };

  const saveCardTitle = (listIndex, cardIndex) => {
    const updatedLists = [...activeBoard.list];
    updatedLists[listIndex].items[cardIndex].title = editingCardTitle;

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
    setEditingCardId(null);
  };

  const startEditingList = (index, title) => {
    setEditingListIndex(index);
    setEditingListTitle(title);
  };

  const saveListTitle = (index) => {
    const updatedLists = [...activeBoard.list];
    updatedLists[index].title = editingListTitle;

    const updatedBoard = { ...allboard };
    updatedBoard.boards[updatedBoard.active].list = updatedLists;
    setAllBoard(updatedBoard);
    setEditingListIndex(null);
  };

  return (
    <div div className="flex flex-col w-full" style={{ backgroundColor: `${activeBoard.bgcolor}` }
    }>
      <div className="flex flex-col w-full flex-grow relative">
        <div className="absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-hidden overflow-y-hidden">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal" type="list">
              {(provided) => (
                <div className="flex" {...provided.droppableProps} ref={provided.innerRef}>
                  {activeBoard.list &&
                    activeBoard.list.map((list, index) => {
                      return (
                        <Draggable key={list.id} draggableId={`list-${list.id}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0"
                            >
                              <div className="list-body">
                                <div className="flex justify-between p-1">
                                  {editingListIndex === index ? (
                                    <input
                                      type="text"
                                      value={editingListTitle}
                                      onChange={(e) => setEditingListTitle(e.target.value)}
                                      onBlur={() => saveListTitle(index)}
                                      className="bg-zinc-700 border-b-2 border-gray-500 focus:outline-none"
                                    />
                                  ) : (
                                    <span>{list.title}</span>
                                  )}
                                  <div className="flex">
                                    <button
                                      onClick={() => startEditingList(index, list.title)}
                                      className="hover:bg-gray-500 p-1 rounded-sm"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => deleteList(index)}
                                      className="hover:bg-red-600 p-1 rounded-sm"
                                    >
                                      <Trash size={16} />
                                    </button>
                                  </div>
                                </div>
                                <Droppable droppableId={list.id} type="card">
                                  {(provided, snapshot) => (
                                    <div
                                      className="py-1"
                                      ref={provided.innerRef}
                                      style={{ backgroundColor: snapshot.isDraggingOver ? "#222" : "transparent" }}
                                      {...provided.droppableProps}
                                    >
                                      {list.items &&
                                        list.items.map((card, idx) => {
                                          return (
                                            <Draggable key={card.id} draggableId={card.id} index={idx}>
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                >
                                                  <div className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500">
                                                    {editingCardId === card.id ? (
                                                      <input
                                                        type="text"
                                                        value={editingCardTitle}
                                                        onChange={(e) => setEditingCardTitle(e.target.value)}
                                                        onBlur={() => saveCardTitle(index, idx)}
                                                        className="bg-zinc-700 border-b-2 border-gray-500 focus:outline-none"
                                                      />
                                                    ) : (
                                                      <span onClick={() => startEditingCard(card)}>{card.title}</span>
                                                    )}
                                                    <span className="flex justify-start items-start">
                                                      <button className="hover:bg-gray-600 p-1 rounded-sm" onClick={() => startEditingCard(card)}>
                                                        <Edit2 size={16} />
                                                      </button>
                                                      <button className="hover:bg-red-600 p-1 rounded-sm" onClick={() => deleteCard(index, idx)}>
                                                        <Trash size={16} />
                                                      </button>
                                                    </span>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          );
                                        })}

                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                                <CardAdd getcard={(text) => addCard(text, index)} />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                  <AddList getlist={addList} />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div >
  );
};

export default Main;
