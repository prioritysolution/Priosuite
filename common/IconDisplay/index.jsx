import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io";
import * as TiIcons from "react-icons/ti";
import * as GoIcons from "react-icons/go";
import * as SiIcons from "react-icons/si";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as RiIcons from "react-icons/ri";
import * as CgIcons from "react-icons/cg";
import * as ImIcons from "react-icons/im";
import * as VscIcons from "react-icons/vsc";
import * as HiIcons from "react-icons/hi";
import * as TbIcons from "react-icons/tb";
import * as PiIcons from "react-icons/pi";
import * as FcIcons from "react-icons/fc";

// Function to get the icon component based on the string name
const getIcon = (iconName, iconSet) => {
  // Map of all available icon sets
  const iconSets = {
    fa: FaIcons,
    md: MdIcons,
    gi: GiIcons,
    io: IoIcons,
    ti: TiIcons,
    go: GoIcons,
    si: SiIcons,
    fi: FiIcons,
    ai: AiIcons,
    bs: BsIcons,
    bi: BiIcons,
    ri: RiIcons,
    cg: CgIcons,
    im: ImIcons,
    vsc: VscIcons,
    hi: HiIcons,
    tb: TbIcons,
    pi: PiIcons,
    fc: FcIcons,
  };

  // Get the correct icon component
  const IconComponent = iconSets[iconSet]?.[iconName];
  return IconComponent ? <IconComponent /> : null;
};

const IconDisplay = ({ iconName, iconSet, ...rest }) => {
  return <span {...rest}>{getIcon(iconName, iconSet)}</span>;
};

export default IconDisplay;
