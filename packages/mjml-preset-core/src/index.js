import { Social, SocialElement } from '../../mjml-social/src'
import { Navbar, NavbarLink } from '../../mjml-navbar/src'
import { Carousel, CarouselImage } from '../../mjml-carousel/src'
import {
  Accordion,
  AccordionElement,
  AccordionText,
  AccordionTitle,
} from '../../mjml-accordion/src'
import Body from '../../mjml-body/src'
import Head from '../../mjml-head/src'
import HeadAttributes from '../../mjml-head-attributes/src'
import HeadBreakpoint from '../../mjml-head-breakpoint/src'
import HeadHtmlAttributes from '../../mjml-head-html-attributes/src'
import HeadFont from '../../mjml-head-font/src'
import HeadPreview from '../../mjml-head-preview/src'
import HeadStyle from '../../mjml-head-style/src'
import HeadTitle from '../../mjml-head-title/src'
import Hero from '../../mjml-hero/src'
import Button from '../../mjml-button/src'
import Column from '../../mjml-column/src'
import Divider from '../../mjml-divider/src'
import Group from '../../mjml-group/src'
import Image from '../../mjml-image/src'
import Raw from '../../mjml-raw/src'
import Section from '../../mjml-section/src'
import Spacer from '../../mjml-spacer/src'
import Text from '../../mjml-text/src'
import Table from '../../mjml-table/src'
import Wrapper from '../../mjml-wrapper/src'
import dependencies from './dependencies'

const components = [
  Body,
  Head,
  HeadAttributes,
  HeadBreakpoint,
  HeadHtmlAttributes,
  HeadFont,
  HeadPreview,
  HeadStyle,
  HeadTitle,
  Hero,
  Button,
  Column,
  Divider,
  Group,
  Image,

  Raw,
  Section,
  Spacer,
  Text,
  Table,
  Wrapper,

  Social,
  SocialElement,
  Navbar,
  NavbarLink,
  Accordion,
  AccordionElement,
  AccordionText,
  AccordionTitle,
  Carousel,
  CarouselImage,
]

const presetCore = {
  components,
  dependencies,
}

export default presetCore
