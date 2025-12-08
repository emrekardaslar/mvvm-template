import api from '../../services/api';

const filterRepository = {
  getFilters: (lang: "en" | "tr" | "ar" = "en") => {
    return api.fetchFilters(lang);
  },
};

export default filterRepository;
