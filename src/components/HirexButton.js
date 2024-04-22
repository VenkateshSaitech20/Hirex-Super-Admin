import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HirexButton = ({ btntype, slug, flag, linkname, redirectTo }) => {
    
    const btnClassMap = {
        success: 'btn-save',
        danger: 'btn-danger',
        warning: 'btn-warning',
        cancel: 'btn-cancel',
        smsuccess: 'btn-sm-success',
    };

    const getButtonClass = (btntype) => {
        const defaultClass = 'btn me-2';
        const mappedClass = btnClassMap[btntype];
        return mappedClass ? `${defaultClass} ${mappedClass}` : defaultClass;
    };

    if (flag === 'button') {
        return (
            <Button className={getButtonClass(btntype)} type="submit">{slug ? 'Update' : 'Submit'}</Button>
        );
    } else if (flag === 'link') {
        return (
            <Link className={getButtonClass(btntype)} to={redirectTo}>{linkname}</Link>
        );
    } else {
        return null;
    }
};

HirexButton.propTypes = {
    btntype: PropTypes.string,
    slug: PropTypes.string,
    linkname: PropTypes.string,
    flag: PropTypes.string,
    redirectTo: PropTypes.string,
};

export default HirexButton;