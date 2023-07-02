import { Button, Input, Slider } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import TgSvg from '../assets/tg.svg'
import IgSvg from '../assets/ig.svg'
import Pointer from '../assets/pointer.svg'

const { Search } = Input

const Dropdown = ({
  open,
  setOpen,
  authStatus,
  handleSearch,
  handleGotoaya,
}) => {
  return (
    <>
      {/* <AnimatePresence> */}
      <motion.div
        className="dropdown-menu drawer-nav"
        animate={{ y: open ? 0 : -380 }}
        transition={{
          type: 'spring',
          stiffness: 210,
          damping: 37,
        }}
      >
        <div className="contain">
          <div className="pointer hbtn" onClick={() => setOpen(false)}>
            <Pointer />
          </div>
          <div className="title">
            <h2>
              <span>al</span>mushaf
            </h2>
            <h1>
              <span>al</span>mubeen
            </h1>
          </div>
          {/* {authStatus === 'authenticated' && (
            <Button type="link" className="logout-btn" onClick={signOut}>
              Logout
            </Button>
          )} */}
          <ul>
            <li>
              <Search
                className="src"
                enterButton={
                  <Button>
                    <ArrowRightOutlined />
                  </Button>
                }
                size="large"
                placeholder="Search the Quran |  ابحث القران"
                onSearch={handleSearch}
              />
            </li>
            <li>
              <span className="label">Go to ayah</span>
              <div>
                <Search
                  className="gotoayah"
                  placeholder="2:255"
                  enterButton={
                    <Button>
                      <ArrowRightOutlined />
                    </Button>
                  }
                  size="large"
                  onSearch={handleGotoaya}
                />
              </div>
            </li>
            <li>
              <span className="label">Font size</span>
              <Slider
                min={100}
                max={170}
                defaultValue={100}
                step={10}
                tooltip={{ formatter: (val) => `${val}%` }}
                onAfterChange={(val) => {
                  onChangeScale(val)
                }}
              />
            </li>
            <li>
              <span className="label">Connect with us</span>
              <div className="social-btns">
                <a
                  href="https://t.me/+kqPyEThUi8QyMWFk"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button type="link" icon={<TgSvg />} />
                </a>
                <a
                  href="https://instagram.com/almubeenapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="ig" type="link" icon={<IgSvg />} />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </motion.div>
      {/* </AnimatePresence> */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dropdown-menu-bg"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
export default Dropdown
