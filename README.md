# SHORTEST-PATH FINDER / VISUALIZER

This project is a simple yet interactive tool built with HTML, CSS, and JavaScript to visualize various pathfinding algorithms commonly used in data structures, such as Depth-First Search (DFS), Breadth-First Search (BFS), A*, and more.


#FEATURES

1. it includes animation
2. it includes the functionality of generating different patterns of maze by just one click .
3. User can control the visualisation speed of the algorithm he is currently visualising .


#Here's a brief description of each algorithm:

1. Depth-First Search (DFS): DFS explores as far as possible along a branch before backtracking.
It uses a stack (either implicitly with recursion or explicitly) and may not guarantee the shortest path.
It’s ideal for exploring all nodes, but can get stuck in deep branches if no solution exists.

2. Breadth-First Search (BFS): BFS explores nodes layer by layer or level by level, starting from the source node and visiting all neighboring nodes before moving to the next level. 
It uses a queue and guarantees finding the shortest path in an unweighted graph.

3. A Algorithm*: A* is a heuristic-based search algorithm that combines the benefits of BFS and Dijkstra’s.
It uses a priority queue to explore nodes with the lowest total cost, where the cost is the sum of the distance from the start and a heuristic (estimated distance to the goal).
A* guarantees the shortest path if the heuristic is admissible (never overestimates).

4. Dijkstra’s Algorithm: Dijkstra’s finds the shortest path from a source to all other nodes in a weighted graph.
It uses a priority queue to always expand the node with the lowest known distance from the source. 
It guarantees finding the shortest path for all nodes when weights are non-negative.

5. Greedy Algorithm: Greedy algorithms make local, immediate choices that seem optimal in the moment, without considering the bigger picture.
In pathfinding, a greedy approach might always choose the closest neighboring node. However, it may not always guarantee the shortest overall path.
Uses heuristic value concept.

#Key Learnings

Learned new algorithms such as A* and Greedy.
Gained a deeper understanding of pathfinding and graph traversal techniques.
1. learned the subdivision generate maze algorithm.
2. seqeuntial animation.
3. for mobile we have pointer events which I have used in place of mouse over events.
4. how can we divide the screen into div 's of small sizes = like using the .clientHeight  and .clientWidht method

Here is the demo

https://github.com/user-attachments/assets/cb51f126-76f3-43a7-8f07-b587049d8aa7

