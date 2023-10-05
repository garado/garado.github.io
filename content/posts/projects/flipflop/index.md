---
title: Making an edge-triggered D flip-flop out of NAND gates
date: 2021-06-20
categories: ["projects", "electrical"]
---

# Overview
The purpose of this project was to design and build an edge-triggered D flip-flop out of NAND gates on a bread board, with three separate LEDs representing the Q and ~Q outputs and the final LED representing the data input. The clock and data inputs are controlled by wires being moved between the power and ground rail.

![The final result. I always make a point to make my circuits extra, extra neat](./dff.png)

A D flip-flop is essentially a unit of storage that stores 1 bit as a 0 or 1. For the purpose of this project, the D flip-flop has 2 inputs called clock and data. The data input holds the value to be stored and the clock input controls when it's stored. Since our design is an edge-triggered flip flop, whatever is on the data input will be stored only on a rising or falling clock edge (when the clock changes from 0 to 1 or 1 to 0). The flip flop also has two outputs: Q and ~Q. Q represents the data that is currently being stored on the flip flop, and ~Q simply represents the inverse of that data.

# Circuit
![Circuit diagram at the gate level.](./diagram.png)

![Circuit diagram using the actual IC.](./ic-diagram.png)

![Breadboard color-coded to match the diagram above.](./breadboard-color-coded.png)

# Whoops.
When I wired everything together, nothing worked. It drove me insane because I had checked, double-checked, and triple-checked everything... except for the chip I was using. It turns out that I was using an op amp that had accidentally fallen into my NAND drawer. That might explain why the chip started melting and why parts started exploding. Lesson learned. I'll be *extra* careful going forward.
