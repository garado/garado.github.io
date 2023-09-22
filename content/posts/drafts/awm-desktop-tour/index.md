---
title: "The desktop tour"
date: 2023-09-07T12:04:16-05:00
categories: ["awesome"]
draft: true
---

When I have free time, I spend a *lot* of it customizing my desktop. You might think that consists of just cherry-picking some colors and fonts that look nice, but it's so much more than that. It's about using (and borderline abusing) AwesomeWM's API to create perfect tools for a perfect workflow that's tailor-made for me.

AwesomeWM, if you're unfamiliar, is a window manager with a built-in UI framework and is configured in Lua. It's incredibly powerful and customizable, and there hasn't been a single idea that I couldn't implement with enough hard work. It embodies both of my favorite things about coding: one, anything is possible; and two, if it isn't, it's because the right tool hasn't been invented yet.

# Taskwarrior
I've tried dozens of task managers in my life. Dozens. None of them have ever worked as well as Taskwarrior. And despite how much I love the command line, I definitely need a solid GUI when I'm working with a to-do list. [taskwarrior-tui](https://github.com/kdheepak/taskwarrior-tui) isn't organized in a way that works with how I personally use Taskwarrior, and a polished Taskwarrior GUI just doesn't exist - or rather, it didn't exist. I made one!

# Google Calendar
A fancy little calendar so I can pop open my schedule to quickly add, view, or modify events. The actual Google Calendar website always loads really slowly and also always seems to flashbang me in the middle of the night. It's powered by [gcalcli](https://github.com/insanum/gcalcli), a CLI for Google Calendar.

# Ledger
To manage my finances, I use [ledger-cli](https://ledger-cli.org), a plain-text accounting system. I like to manually record all of my transactions because it keeps me accountable and aware of my spending.

# Old features
I wrote a bus tracker to help me get home on time as I lived kind of far from my school. It scraped data from my county's transit website to tell me when buses would arrive at nearby stops and with the help of [Pushover](https://pushover.net/) sent notifications to my phone when buses started getting close. I no longer use it because I graduated and I'm no longer at the mercy of the bus schedule, but it was incredibly useful while it lasted!
