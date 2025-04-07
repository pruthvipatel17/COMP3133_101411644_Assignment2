import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  // Make sure this URL matches your backend GraphQL endpoint
  private readonly API_URL = 'http://localhost:8082/graphql';

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initApollo();
  }

  private initApollo(): void {
    // Create the HTTP link
    const http = this.httpLink.create({
      uri: this.API_URL
    });

    // Create the auth link
    const auth = setContext((_, { headers }) => {
      // Get the authentication token from local storage if in browser environment
      let token = null;
      if (isPlatformBrowser(this.platformId)) {
        token = localStorage.getItem('token');
      }

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
        }
      };
    });

    // Create the Apollo client
    this.apollo.create({
      link: ApolloLink.from([auth, http]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      }
    });
  }
}
