"use client";

import HeroSectionOne from "@/components/hero-section-demo-1";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";

import React from 'react'

const page = () => {
  return (
    <HeroSectionOne />
  )
}

export default page

